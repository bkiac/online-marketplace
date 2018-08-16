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

    this.calculateWithdrawAvailability = this.calculateWithdrawAvailability.bind(this);
    this.handleShipping = this.handleShipping.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
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
          this.MarketContract.methods.withdrawToVendor.cacheSend(product.id, { gas: 40000 });
          break;
        case StateEnum.Shipped:
          this.MarketContract.methods.withdrawToVendorAfterExpirationDate.cacheSend(product.id);
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

      return (
        <ProductForSale
          product={product}
          escrow={escrow}
          isWithdrawable={isWithdrawable}
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
