import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import Buy from './Buy';
import { filterProductsByState, getProductKeysFromCache, values } from '../../util/helpers';

class BuyContainer extends Component {
  static sanitizeProducts(products) {
    return filterProductsByState(values(products), 'New');
  }

  constructor(props, context) {
    super(props);

    const { Market: MarketState } = props;

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
      const products = BuyContainer.sanitizeProducts(MarketState.products);

      return (
        <Buy
          products={products}
        />
      );
    }

    return (
      <Buy />
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
