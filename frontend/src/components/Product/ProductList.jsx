import React from 'react';
import { CardColumns } from 'reactstrap';

import Product from './Product';

const ProductList = (props) => {
  const { productList } = props;

  return (
    <CardColumns>
      {
        productList.map(product => (
          <Product
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            guaranteedShippingTime={product.guaranteedShippingTime}
          />
        ))
      }
    </CardColumns>
  );
};

export default ProductList;
