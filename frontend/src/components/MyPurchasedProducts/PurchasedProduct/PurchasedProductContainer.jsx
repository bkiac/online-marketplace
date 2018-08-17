import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import StateEnum from '../../../util/StateEnum';
import PurchasedProduct from './PurchasedProduct';

class PurchasedProductContainer extends Component {
  constructor(props, context) {
    super(props);

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    this.keyToConflictPeriod = this.MarketContract.methods.conflictPeriod.cacheCall();

    this.calculateProductNotShippedConflictDate = this.calculateProductNotShippedConflictDate
      .bind(this);
    this.isWithdrawable = this.isWithdrawable.bind(this);
    this.calculateMaxShippingDate = this.calculateMaxShippingDate.bind(this);
    this.calculateProductNotReceivedConflictDate = this.calculateProductNotReceivedConflictDate
      .bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.isFlaggable = this.isFlaggable.bind(this);
    this.handleFlagging = this.handleFlagging.bind(this);
    this.handleReceive = this.handleReceive.bind(this);
  }

  calculateProductNotShippedConflictDate() {
    const { product } = this.props;

    const dateOfPurchase = moment(Number.parseInt(product.dateOfPurchase) * 1000);
    return dateOfPurchase.add(
      Number.parseInt(product.guaranteedShippingTime),
      'seconds',
    );
  }

  isWithdrawable() {
    const { account, product } = this.props;

    if (product.customer !== account) {
      return false;
    }

    const withdrawAvailableDate = this.calculateProductNotShippedConflictDate();

    return (product.state === StateEnum.Purchased) && (moment().isAfter(withdrawAvailableDate));
  }

  handleWithdraw() {
    const { product } = this.props;

    if (this.isWithdrawable()) {
      this.MarketContract.methods.withdrawToCustomer.cacheSend(product.id);
    }
  }

  calculateMaxShippingDate() {
    const { product } = this.props;

    const dateOfShipping = moment(Number.parseInt(product.dateOfShipping) * 1000);
    return dateOfShipping.add(
      Number.parseInt(product.guaranteedShippingTime),
      'seconds',
    );
  }

  calculateProductNotReceivedConflictDate() {
    const { product, Market: MarketState } = this.props;

    const dateOfShipping = moment(Number.parseInt(product.dateOfShipping) * 1000);
    const maxShippingDate = dateOfShipping.add(
      Number.parseInt(product.guaranteedShippingTime),
      'seconds',
    );
    const conflictPeriod = Number.parseInt(
      MarketState.conflictPeriod[this.keyToConflictPeriod].value,
    );

    return maxShippingDate.add(conflictPeriod, 'seconds');
  }

  isFlaggable() {
    const maxShippingDate = this.calculateMaxShippingDate();
    const endOfConflictDate = this.calculateProductNotShippedConflictDate(maxShippingDate);

    return moment().isAfter(maxShippingDate) && moment().isBefore(endOfConflictDate);
  }

  handleFlagging() {
    const { account, product } = this.props;

    if (product.state === StateEnum.Shipped && product.customer === account) {
      if (this.isFlaggable()) {
        this.MarketContract.methods.withdrawToCustomer(product.id);
      }
    }
  }

  handleReceive() {
    const { account, product } = this.props;

    if (product.state === StateEnum.Shipped && product.customer === account) {
      this.MarketContract.methods.receiveProduct.cacheSend(product.id);
    }
  }

  render() {
    const { product, Market: MarketState } = this.props;

    if (this.keyToConflictPeriod in MarketState.conflictPeriod) {
      const productNotShippedConflictDate = this.calculateProductNotShippedConflictDate();
      const maxShippingDate = this.calculateMaxShippingDate();
      const productNotReceivedConflictDate = this.calculateProductNotReceivedConflictDate(
        maxShippingDate,
      );

      return (
        <PurchasedProduct
          product={product}
          productNotShippedConflictDate={productNotShippedConflictDate}
          maxShippingDate={maxShippingDate}
          productNotReceivedConflictDate={productNotReceivedConflictDate}
          isWithdrawable={this.isWithdrawable()}
          handleWithdraw={this.handleWithdraw}
          isFlaggable={this.isFlaggable()}
          handleFlagging={this.handleFlagging}
          handleReceive={this.handleReceive}
        />
      );
    }

    return (
      <PurchasedProduct />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
  Market: state.contracts.Market,
});

PurchasedProductContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(PurchasedProductContainer, mapStateToProps);
