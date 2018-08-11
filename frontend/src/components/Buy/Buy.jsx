import React from 'react';

import { ProductList } from '../Product';

const Buy = ({ account, products }) => {
  if (products) {
    return (
      <ProductList
        account={account}
        products={products}
      />
    );
  }

  return (
    <p>Loading products...</p>
  );
};

export default Buy;
