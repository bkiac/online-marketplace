import React from 'react';

import { ProductList } from '../Product';

const MyProductsForSale = ({ products }) => {
  if (products) {
    return (
      <ProductList
        products={products}
      />
    );
  }

  return (
    <p>Loading products for sale...</p>
  );
};

export default MyProductsForSale;
