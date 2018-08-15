import React from 'react';
import { CardColumns } from 'reactstrap';

import ProductContainer from './ProductContainer';

const ProductList = ({ products }) => (
  <CardColumns>
    {
      products.map(product => (
        <ProductContainer
          key={product.id}
          product={product}
        />
      ))
    }
  </CardColumns>
);

export default ProductList;
