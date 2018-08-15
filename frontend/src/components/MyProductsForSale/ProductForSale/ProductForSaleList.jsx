import React from 'react';
import { CardDeck } from 'reactstrap';

import ProductForSaleContainer from './ProductForSaleContainer';

const ProductsForSaleList = ({ products }) => (
  <CardDeck>
    {
      products.map(product => (
        <ProductForSaleContainer
          key={product.id}
          product={product}
        />
      ))
    }
  </CardDeck>
);

export default ProductsForSaleList;
