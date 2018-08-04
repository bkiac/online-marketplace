import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import Product from './Product';

class ProductContainer extends Component {
  static handlePurchase(id) {
    console.log(id);
  }

  constructor(props, context) {
    super(props);

    this.contracts = context.drizzle.contracts;

    // this.handlePurchase = this.handlePurchase.bind(this);
  }

  render() {
    return (
      <Product />
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});

ProductContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(ProductContainer, mapStateToProps);
