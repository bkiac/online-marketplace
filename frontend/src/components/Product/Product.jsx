import React from 'react';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import { weiToEther } from '../../util/helpers';

const Product = (props) => {
  const {
    id,
    vendor,
    name,
    price,
    guaranteedShippingTime,
    isPurchaseDisabled,
    handlePurchase,
  } = props;

  return (
    <Card>
      <CardBody>
        <CardTitle>[{id}] {name}</CardTitle>
        <CardSubtitle>Price: {weiToEther(price)} ether</CardSubtitle>
        <CardText>
          Vendor: {vendor}
          <br />
          The shipment will arrive in maximum {guaranteedShippingTime} days after purchase.
        </CardText>
        <Button onClick={handlePurchase} disabled={isPurchaseDisabled}>Purchase</Button>
      </CardBody>
    </Card>
  );
};

export default Product;
