import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardColumns } from 'reactstrap';
import uuidv1 from 'uuid/v1';

import ProductList from '../product/ProductList';

class Buy extends Component {
  constructor(props, context) {
    super(props);

    this.contracts = context.drizzle.contracts;

    this.state = {
      productList: [],
    };
  }

  async componentDidMount() {
    const productList = await this.getProductList();

    const productListWithIds = productList.map(product => (
      { id: uuidv1(), ...product }
    ));

    this.setState({
      productList: productListWithIds,
    });
  }

  async getProductList() {
    const { Market } = this.contracts;
    const productList = [];

    const numOfProducts = await Market.methods.getNumOfProducts().call();

    for (let i = 0; i < numOfProducts; i += 1) {
      productList.push(Market.methods.products(i).call());
    }

    return Promise.all(productList);
  }

  render() {
    const { productList } = this.state;

    return (
      <CardColumns>
        <ProductList
          productList={productList}
        />
      </CardColumns>
    );
  }
}

Buy.contextTypes = {
  drizzle: PropTypes.object,
};

export default Buy;
