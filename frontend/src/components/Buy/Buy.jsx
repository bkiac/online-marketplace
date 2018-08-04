import React from 'react';

import { ProductList } from '../Product';

const Buy = (props) => {
  const { account, productList } = props;

  return (
    <ProductList
      account={account}
      productList={productList}
    />
  );
};

export default Buy;
