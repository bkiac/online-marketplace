import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';

import ProductDispute from './ProductDispute';

class ProductDisputeContainer extends Component {
  constructor(props, context) {
    super(props);

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    const keyToOwner = this.MarketContract.methods.owner.cacheCall();

    this.dataKeys = {
      owner: keyToOwner,
    };

    this.isAccountTheOwner = this.isAccountTheOwner.bind(this);
    this.handleDisputeResolution = this.handleDisputeResolution.bind(this);
  }

  isAccountTheOwner() {
    const { account, Market: MarketState } = this.props;

    const owner = MarketState.owner[this.dataKeys.owner].value;

    return owner === account;
  }

  handleDisputeResolution(inFavor) {
    const { product } = this.props;

    if (this.isAccountTheOwner()) {
      this.MarketContract.methods.resolveDispute.cacheSend(product.id, inFavor);
    }
  }

  render() {
    const { product, Market: MarketState } = this.props;

    if (this.dataKeys.owner in MarketState.owner) {
      return (
        <ProductDispute
          product={product}
          handleDisputeResolution={this.handleDisputeResolution}
        />
      );
    }

    return (
      <ProductDispute />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
  Market: state.contracts.Market,
});

ProductDisputeContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(ProductDisputeContainer, mapStateToProps);
