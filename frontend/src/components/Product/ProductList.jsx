import React from 'react';
import { CardColumns } from 'reactstrap';

import ProductContainer from './ProductContainer';

const ProductList = ({ account, products }) => (
  <CardColumns>
    {
      products.map(p => (
        <ProductContainer
          key={p.id}
          account={account}
          id={p.id}
          vendor={p.vendor}
          name={p.name}
          price={p.price}
          guaranteedShippingTime={p.guaranteedShippingTime}
        />
      ))
    }
  </CardColumns>
);

export default ProductList;
