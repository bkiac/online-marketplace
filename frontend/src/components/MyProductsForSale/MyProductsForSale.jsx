import React from 'react';

import { ProductForSaleList } from './ProductForSale';

const MyProductsForSale = ({ products }) => {
  if (products) {
    return (
      <ProductForSaleList
        products={products}
      />
    );
  }

  return (
    <p>Loading products for sale...</p>
  );
};

export default MyProductsForSale;
