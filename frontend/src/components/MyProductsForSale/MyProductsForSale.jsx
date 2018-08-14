import React from 'react';

import ProductForSaleList from './ProductForSaleList';

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
