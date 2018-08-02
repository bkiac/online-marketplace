import React from 'react';

import Product from './Product';

const ProductList = (props) => {
  const { productList } = props;

  return (
    productList.map(product => (
      <Product
        key={product.id}
        name={product.name}
        price={product.price}
        guaranteedShippingTime={product.guaranteedShippingTime}
      />
    ))
  );
};

export default ProductList;
