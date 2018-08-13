import React from 'react';
import { CardColumns } from 'reactstrap';

import { ProductForSaleContainer } from './index';

const ProductsForSaleList = ({ products }) => (
  <CardColumns>
    {
      products.map(product => (
        <ProductForSaleContainer
          key={product.id}
          product={product}
        />
      ))
    }
  </CardColumns>
);

export default ProductsForSaleList;
