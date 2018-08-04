import React from 'react';
import { CardColumns } from 'reactstrap';

import ProductContainer from './ProductContainer';

const ProductList = (props) => {
  const { account, productList } = props;

  return (
    <CardColumns>
      {
        productList.map(product => (
          <ProductContainer
            key={product.id}
            account={account}
            id={product.id}
            vendor={product.vendor}
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
