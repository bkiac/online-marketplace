import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import Product from './Product';

class ProductContainer extends Component {
  constructor(props, context) {
    super(props);

    const { account, id, vendor, name, price, guaranteedShippingTime } = props;

    this.contracts = context.drizzle.contracts;

    this.handlePurchase = this.handlePurchase.bind(this);

    this.state = {
      account,
      id,
      vendor,
      name,
      price,
      guaranteedShippingTime,
    };
  }

  handlePurchase() {
    const { id, price } = this.state;

    const { Market } = this.contracts;

    Market.methods.purchaseProduct(id).send({ value: price });
  }

  render() {
    const { account, id, vendor, name, price, guaranteedShippingTime } = this.state;

    const isPurchaseDisabled = account === vendor;

    return (
      <Product
        key={id}
        id={id}
        vendor={vendor}
        name={name}
        price={price}
        guaranteedShippingTime={guaranteedShippingTime}
        isPurchaseDisabled={isPurchaseDisabled}
        handlePurchase={this.handlePurchase}
      />
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
