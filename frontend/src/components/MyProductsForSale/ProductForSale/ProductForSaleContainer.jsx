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

    this.keyToEscrow = this.MarketContract.methods.escrows.cacheCall(product.id);

    this.calculateWithdrawAvailability = this.calculateWithdrawAvailability.bind(this);
    this.handleShipping = this.handleShipping.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
  }

  calculateWithdrawAvailability() {
    const { account, product, Market: MarketState } = this.props;

    if (product.vendor !== account) {
      return false;
    }

    const escrow = MarketState.escrows[this.keyToEscrow].value;
    const expirationDate = moment(escrow.expirationDate * 1000);
    const withdrawAvailableDate = expirationDate.add(3, 'days');

    return (product.state === StateEnum.Received)
      || (product.state === StateEnum.Shipped && moment() > withdrawAvailableDate);
  }

  handleShipping() {
    const { account, product } = this.props;

    if (product.state === StateEnum.Purchased && product.vendor === account) {
      this.MarketContract.methods.shipProduct(product.id).cacheSend();
    }
  }

  handleWithdraw() {
    const { product } = this.props;

    const isWithdrawable = this.calculateWithdrawAvailability();

    if (isWithdrawable) {
      switch (product.state) {
        case StateEnum.Received:
          this.MarketContract.methods.withdrawToVendor.cacheSend(product.id);
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

    if (this.keyToEscrow in MarketState.escrows) {
      const { product } = this.props;

      const escrow = MarketState.escrows[this.keyToEscrow].value;

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
