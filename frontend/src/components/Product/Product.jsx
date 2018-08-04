import React from 'react';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import { weiToEther } from '../../helpers';

const Product = (props) => {
  const { id, name, price, guaranteedShippingTime } = props;

  return (
    <Card>
      <CardBody>
        <CardTitle>[{id}] {name}</CardTitle>
        <CardSubtitle>Price: {weiToEther(price)} ether</CardSubtitle>
        <CardText>
          The shipment will arrive in maximum {guaranteedShippingTime} days after purchase.
        </CardText>
        <Button>Purchase</Button>
      </CardBody>
    </Card>
  );
};

export default Product;
