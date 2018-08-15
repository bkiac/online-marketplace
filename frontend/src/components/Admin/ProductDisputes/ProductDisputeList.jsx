import React from 'react';
import { CardColumns } from 'reactstrap';

import ProductDisputeContainer from './ProductDisputeContainer';

const ProductDisputeList = ({ products }) => (
  <CardColumns>
    {
      products.map(product => (
        <ProductDisputeContainer
          key={product.id}
          product={product}
        />
      ))
    }
  </CardColumns>
);

export default ProductDisputeList;
