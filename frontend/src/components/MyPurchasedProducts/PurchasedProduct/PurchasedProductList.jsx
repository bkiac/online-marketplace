import React from 'react';
import { CardDeck } from 'reactstrap';

import PurchasedProductContainer from './PurchasedProductContainer';

const PurchasedProductList = ({ products }) => (
  <CardDeck>
    {
      products.map(product => (
        <PurchasedProductContainer
          key={product.id}
          product={product}
        />
      ))
    }
  </CardDeck>
);

export default PurchasedProductList;
