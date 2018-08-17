import React from 'react';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import { weiToEther } from '../../../../util/helpers';

const ProductDispute = ({ product, handleDisputeResolution }) => {
  if (product) {
    return (
      <Card>
        <CardBody>
          <CardTitle>[{product.id}] {product.name}</CardTitle>
          <CardSubtitle>Price: {weiToEther(product.price)} ether</CardSubtitle>
          <CardText>
            Vendor: {product.vendor}
            <br />
            Customer: {product.customer}
          </CardText>
          <Button
            onClick={() => handleDisputeResolution(product.vendor)}
          >
            In favor of vendor
          </Button>
          <Button
            onClick={() => handleDisputeResolution(product.customer)}
          >
            In favor of customer
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div />
  );
};

export default ProductDispute;
