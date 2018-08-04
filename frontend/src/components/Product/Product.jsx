import React from 'react';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import { weiToEther } from '../../helpers';

const Product = (props) => {
  const { name, price, guaranteedShippingTime } = props;

  return (
    <Card>
      <CardBody>
        <CardTitle>{name}</CardTitle>
        <CardSubtitle>Price: {weiToEther(price)} ether</CardSubtitle>
        <CardText>
          The shipment will arrive in maximum {guaranteedShippingTime} days after purchase.
        </CardText>
        <Button>Button</Button>
      </CardBody>
    </Card>
  );
};

export default Product;
