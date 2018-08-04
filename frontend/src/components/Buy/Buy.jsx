import React from 'react';

import { ProductList } from '../Product';

const Buy = (props) => {
  const { productList } = props;

  return (
    <ProductList
      productList={productList}
    />
  );
};

export default Buy;
