import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { filterProductsByVendor, getProductKeysFromCache, values } from '../../util/helpers';
import { MyProductsForSale } from './index';

class MyProductsForSaleContainer extends Component {
  constructor(props, context) {
    super(props);

    const { Market: MarketState } = this.props;

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    this.dataKeys = getProductKeysFromCache(MarketState, this.MarketContract);

    this.sanitizeProducts = this.sanitizeProducts.bind(this);
  }

  componentDidUpdate() {
    const { Market: MarketState } = this.props;

    this.dataKeys = getProductKeysFromCache(MarketState, this.MarketContract);
  }

  sanitizeProducts(products) {
    const { account } = this.props;

    return filterProductsByVendor(values(products), account);
  }

  render() {
    const { Market: MarketState } = this.props;

    if (this.dataKeys.numOfProducts in MarketState.numOfProducts
      && this.dataKeys.products[0] in MarketState.products) {
      // numOfProducts and at least one of the products has loaded
      const products = this.sanitizeProducts(MarketState.products);

      return (
        <MyProductsForSale
          products={products}
        />
      );
    }

    return (
      <MyProductsForSale />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
  Market: state.contracts.Market,
});

MyProductsForSaleContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(MyProductsForSaleContainer, mapStateToProps);
