import React from 'react';

import { ProductDisputeList } from './ProductDispute';

const ProductDisputes = ({ products }) => {
  if (products) {
    return (
      <ProductDisputeList
        products={products}
      />
    );
  }

  return (
    <p>Loading product disputes...</p>
  );
};


export default ProductDisputes;
