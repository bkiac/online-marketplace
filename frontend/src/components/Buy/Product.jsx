import React from 'react';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import { weiToEther } from '../../util/helpers';

const Product = ({ product, isPurchasable, handlePurchase }) => (
  <Card>
    <CardBody>
      <CardTitle>[{product.id}] {product.name}</CardTitle>
      <CardSubtitle>Price: {weiToEther(product.price)} ether</CardSubtitle>
      <CardText>
        Vendor: {product.vendor}
        <br />
        The shipment will arrive in maximum {product.guaranteedShippingTime} days after purchase.
      </CardText>
      <Button
        color={isPurchasable ? 'primary' : 'secondary'}
        disabled={!isPurchasable}
        onClick={handlePurchase}
      >
        Purchase
      </Button>
    </CardBody>
  </Card>
);

export default Product;
