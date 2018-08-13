import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import StateEnum from '../../util/StateEnum';
// import { addDays } from '../../util/helpers';
import { addMinutes } from '../../util/helpers';
import ProductForSale from './ProductForSale';

class ProductForSaleContainer extends Component {
  constructor(props, context) {
    super(props);

    const { product } = props;

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    this.keyToEscrow = this.MarketContract.methods.escrows.cacheCall(product.id);

    this.handleShipping = this.handleShipping.bind(this);
  }

  handleShipping() {
    const { account, product } = this.props;

    if (product.state === StateEnum.Purchased && product.vendor === account) {
      this.MarketContract.methods.shipProduct(product.id).send();
    }
  }

  handleWithdraw() {
    const { account, product, Market: MarketState } = this.props;

    const escrow = MarketState.escrows[this.keyToEscrow].value;
    const expirationDate = new Date(escrow.expirationDate);
    // const withdrawAvailableDate = addDays(expirationDate, 3);
    const withdrawAvailableDate = addMinutes(expirationDate, 3);

    if (product.state === StateEnum.Received && product.vendor === account) {
      this.MarketContract.methods.withdrawToVendor(product.id).send();
    } else if (product.state === StateEnum.Shipped && Date.now() > withdrawAvailableDate) {
      this.MarketContract.methods.withdrawToVendorAfterExpirationDate(product.id).send();
    }
  }

  render() {
    const { Market: MarketState } = props;

    if (this.keyToEscrow in MarketState.escrows) {
      const { product } = this.props;
      const escrow = MarketState.escrows[this.keyToEscrow].value;

      return (
        <ProductForSale

        />
      )
    }

    return (
      <ProductForSale
        product={product}
      />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
});

ProductForSaleContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(ProductForSaleContainer, mapStateToProps);
