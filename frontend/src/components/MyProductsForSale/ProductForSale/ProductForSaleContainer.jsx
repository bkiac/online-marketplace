import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import StateEnum from '../../../util/StateEnum';
import ProductForSale from './ProductForSale';

class ProductForSaleContainer extends Component {
  constructor(props, context) {
    super(props);

    const { product } = props;

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    const keyToEscrow = this.MarketContract.methods.escrows.cacheCall(product.id);
    const keyToConflictPeriod = this.MarketContract.methods.conflictPeriod.cacheCall();
    this.dataKeys = {
      escrow: keyToEscrow,
      conflictPeriod: keyToConflictPeriod,
    };

    this.calculateProductNotShippedConflictDate = this.calculateProductNotShippedConflictDate
      .bind(this);
    this.calculateProductNotReceivedConflictDate = this.calculateProductNotReceivedConflictDate
      .bind(this);
    this.calculateWithdrawAvailability = this.calculateWithdrawAvailability.bind(this);
    this.handleShipping = this.handleShipping.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
  }

  calculateProductNotShippedConflictDate() {
    const { product, Market: MarketState } = this.props;

    const dateOfPurchase = moment(Number.parseInt(product.dateOfPurchase) * 1000);
    const conflictPeriod = Number.parseInt(
      MarketState.conflictPeriod[this.dataKeys.conflictPeriod].value,
    );

    return dateOfPurchase.add(conflictPeriod, 'seconds');
  }

  calculateProductNotReceivedConflictDate() {
    const { product, Market: MarketState } = this.props;

    const dateOfShipping = moment(Number.parseInt(product.dateOfShipping) * 1000);
    const maxShippingDate = dateOfShipping.add(
      Number.parseInt(product.guaranteedShippingTime),
      'seconds',
    );
    const conflictPeriod = Number.parseInt(
      MarketState.conflictPeriod[this.dataKeys.conflictPeriod].value,
    );

    return maxShippingDate.add(conflictPeriod, 'seconds');
  }

  calculateWithdrawAvailability() {
    const { account, product, Market: MarketState } = this.props;

    if (product.vendor !== account) {
      return false;
    }

    const conflictPeriod = Number.parseInt(
      MarketState.conflictPeriod[this.dataKeys.conflictPeriod].value,
    );
    const escrow = MarketState.escrows[this.dataKeys.escrow].value;
    const expirationDate = moment(Number.parseInt(escrow.expirationDate) * 1000);
    const withdrawAvailableDate = expirationDate.add(conflictPeriod, 'seconds');

    return (product.state === StateEnum.Received)
      || (product.state === StateEnum.Shipped && moment().isAfter(withdrawAvailableDate));
  }

  handleShipping() {
    const { account, product } = this.props;

    if (product.state === StateEnum.Purchased && product.vendor === account) {
      this.MarketContract.methods.shipProduct.cacheSend(product.id);
    }
  }

  handleWithdraw() {
    const { product } = this.props;

    if (this.calculateWithdrawAvailability()) {
      switch (product.state) {
        case StateEnum.Received:
          this.MarketContract.methods.withdrawToVendor.cacheSend(product.id, { gas: 50000 });
          break;
        case StateEnum.Shipped:
          this.MarketContract.methods.withdrawToVendorAfterExpirationDate
            .cacheSend(product.id, { gas: 50000 });
          break;
        default:
          break;
      }
    }
  }

  render() {
    const { Market: MarketState } = this.props;

    if (this.dataKeys.conflictPeriod in MarketState.conflictPeriod
      && this.dataKeys.escrow in MarketState.escrows) {
      const { product } = this.props;

      const escrow = MarketState.escrows[this.dataKeys.escrow].value;

      const isWithdrawable = this.calculateWithdrawAvailability();
      const shipProductUntil = this.calculateProductNotShippedConflictDate();
      const gts = moment.duration(Number.parseInt(product.guaranteedShippingTime), 'seconds')
        .asDays();
      const withdrawAvailableAt = this.calculateProductNotReceivedConflictDate();

      return (
        <ProductForSale
          product={product}
          escrow={escrow}
          isWithdrawable={isWithdrawable}
          shipProductUntil={shipProductUntil}
          guaranteedShippingTime={gts}
          withdrawAvailableAt={withdrawAvailableAt}
          handleShipping={this.handleShipping}
          handleWithdraw={this.handleWithdraw}
        />
      );
    }

    return (
      <ProductForSale />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
  Market: state.contracts.Market,
});

ProductForSaleContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(ProductForSaleContainer, mapStateToProps);
