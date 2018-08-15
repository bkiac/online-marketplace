import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import StateEnum from '../../../util/StateEnum';
import PurchasedProduct from './PurchasedProduct';

class PurchasedProductContainer extends Component {
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
    this.handleWithdraw = this.handleWithdraw.bind(this);
  }

  calculateWithdrawAvailability() {
    const { account, product, Market: MarketState } = this.props;

    if (product.customer !== account) {
      return false;
    }

    const conflictPeriod = Number.parseInt(
      MarketState.conflictPeriod[this.dataKeys.conflictPeriod].value,
    );
    const dateOfPurchase = moment(Number.parseInt(product.dateOfPurchase) * 1000);
    const withdrawAvailableDate = dateOfPurchase.add(conflictPeriod, 'seconds');

    return (product.state === StateEnum.Purchased) && (moment().isAfter(withdrawAvailableDate));
  }

  handleWithdraw() {
    const { product } = this.props;

    if (this.calculateWithdrawAvailability()) {
      this.MarketContract.methods.withdrawToCustomer.cacheSend(product.id);
    }
  }

  // handleFlagging() {
  //   const { product } = this.props;
  //
  //   if (product.state === State.Shipped) {
  //
  //   }
  // }

  render() {
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
