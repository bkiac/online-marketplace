import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import Product from './Product';

class ProductContainer extends Component {
  constructor(props, context) {
    super(props);

    const { drizzle: { contracts: { Market } } } = context;

    this.MarketContract = Market;

    this.handlePurchase = this.handlePurchase.bind(this);
  }

  handlePurchase() {
    const { account, product } = this.props;

    if (account !== product.vendor) {
      this.MarketContract.methods.purchaseProduct(product.id).send({ value: product.price });
    }
  }

  render() {
    const { account, product } = this.props;

    const isPurchasable = account !== product.vendor;

    return (
      <Product
        product={product}
        isPurchasable={isPurchasable}
        handlePurchase={this.handlePurchase}
      />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
});

ProductContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(ProductContainer, mapStateToProps);
