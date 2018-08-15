import React from 'react';

import { ProductList } from '../Buy/Product';

const MyPurchasedProducts = ({ products }) => {
  if (products) {
    return (
      <ProductList
        products={products}
      />
    );
  }

  return (
    <p>Loading purchased products...</p>
  );
};

export default MyPurchasedProducts;
