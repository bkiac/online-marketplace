import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import Buy from './Buy';
import { filterProductsByState } from '../../util/helpers';

class BuyContainer extends Component {
  constructor(props, context) {
    super(props);

    this.contracts = context.drizzle.contracts;

    const { accounts } = props;

    this.state = {
      account: accounts[0],
      productList: [],
    };
  }

  async componentDidMount() {
    const productList = filterProductsByState(await this.getFullProductList(), 'New');

    this.setState({
      productList,
    });
  }

  async getFullProductList() {
    const { Market } = this.contracts;
    const productList = [];

    const numOfProducts = await Market.methods.getNumOfProducts().call();

    for (let i = 0; i < numOfProducts; i += 1) {
      productList.push(Market.methods.products(i).call());
    }

    return Promise.all(productList);
  }

  render() {
    const { account, productList } = this.state;

    return (
      <Buy
        account={account}
        productList={productList}
      />
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});

BuyContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(BuyContainer, mapStateToProps);
