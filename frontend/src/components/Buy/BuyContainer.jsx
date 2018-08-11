import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import Buy from './Buy';
import { filterProductsByState, values } from '../../util/helpers';

class BuyContainer extends Component {
  static sanitizeProducts(products) {
    return filterProductsByState(values(products), 'New');
  }

  constructor(props, context) {
    super(props);

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    const keyToNumOfProducts = Market.methods.numOfProducts.cacheCall();
    this.dataKeys = {
      numOfProducts: keyToNumOfProducts,
      products: [],
    };
  }

  componentDidUpdate() {
    const { Market: MarketState } = this.props;

    const numOfProducts = Number.parseInt(
      MarketState.numOfProducts[this.dataKeys.numOfProducts].value,
    );

    const keysToProducts = [];
    for (let i = 0; i < numOfProducts; i += 1) {
      keysToProducts.push(this.MarketContract.methods.products.cacheCall(i));
    }

    this.dataKeys = {
      ...this.dataKeys,
      products: keysToProducts,
    };
  }

  render() {
    const { Market: MarketState } = this.props;

    if (!(this.dataKeys.numOfProducts in MarketState.numOfProducts)
      && !(this.dataKeys.products === [])) {
      return (
        <Buy />
      );
    }

    const products = BuyContainer.sanitizeProducts(MarketState.products);

    return (
      <Buy
        products={products}
      />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  Market: state.contracts.Market,
});

BuyContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(BuyContainer, mapStateToProps);
