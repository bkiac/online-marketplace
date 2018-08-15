import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';

import { filterProductsByState, getProductKeysFromCache, values } from '../../../util/helpers';
import ProductDisputes from './ProductDisputes';

class ProductDisputesContainer extends Component {
  static sanitizeProducts(products) {
    return filterProductsByState(values(products), 'Flagged');
  }

  constructor(props, context) {
    super(props);

    const { Market: MarketState } = this.props;

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    this.dataKeys = getProductKeysFromCache(MarketState, this.MarketContract);
  }

  componentDidUpdate() {
    const { Market: MarketState } = this.props;

    this.dataKeys = getProductKeysFromCache(MarketState, this.MarketContract);
  }

  render() {
    const { Market: MarketState } = this.props;

    if (this.dataKeys.numOfProducts in MarketState.numOfProducts
      && this.dataKeys.products[0] in MarketState.products) {
      // numOfProducts and at least one of the products has loaded
      const products = ProductDisputesContainer.sanitizeProducts(MarketState.products);

      return (
        <ProductDisputes
          products={products}
        />
      );
    }

    return (
      <ProductDisputes />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
  Market: state.contracts.Market,
});

ProductDisputesContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(ProductDisputesContainer, mapStateToProps);
