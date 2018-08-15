import React from 'react';

import { PurchasedProductList } from './PurchasedProduct';

const MyPurchasedProducts = ({ products }) => {
  if (products) {
    return (
      <PurchasedProductList
        products={products}
      />
    );
  }

  return (
    <p>Loading purchased products...</p>
  );
};

export default MyPurchasedProducts;
