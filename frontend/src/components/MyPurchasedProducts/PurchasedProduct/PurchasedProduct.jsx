import React from 'react';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';

import StateEnum from '../../../util/StateEnum';
import { weiToEther } from '../../../util/helpers';

const PurchasedProduct = ({
  product,
  productNotShippedConflictDate,
  maxShippingDate,
  productNotReceivedConflictDate,
  isWithdrawable,
  handleWithdraw,
  isFlaggable,
  handleFlagging,
  handleReceive,
}) => {
  if (product) {
    switch (product.state) {
      case StateEnum.Purchased: {
        return (
          <Card>
            <CardBody>
              <CardTitle>[{product.id}] {product.name}</CardTitle>
              <CardSubtitle>Price: {weiToEther(product.price)} ether</CardSubtitle>
              <CardSubtitle>State: Purchased</CardSubtitle>
              <CardText>
                <i>Vendor: {product.vendor}</i>
                <br />
                The vendor must ship to product until {
                  productNotShippedConflictDate.format('YYYY-MM-DD HH:mm')
                }.
              </CardText>
              <Button
                color={isWithdrawable ? 'primary' : 'secondary'}
                disabled={!isWithdrawable}
                onClick={handleWithdraw}
              >
                Withdraw
              </Button>
            </CardBody>
          </Card>
        );
      }
      case StateEnum.Shipped: {
        return (
          <Card>
            <CardBody>
              <CardTitle>[{product.id}] {product.name}</CardTitle>
              <CardSubtitle>Price: {weiToEther(product.price)} ether</CardSubtitle>
              <CardSubtitle>State: Shipped</CardSubtitle>
              <CardText>
                <i>Vendor: {product.vendor}</i>
                <br />
                If you haven't received the shipment until {
                  maxShippingDate.format('YYYY-MM-DD HH:mm')
                }, you can flag this product for admin review until {
                  productNotReceivedConflictDate.format('YYYY-MM-DD HH:mm')
                }.
              </CardText>
              <Button
                color={isFlaggable ? 'danger' : 'secondary'}
                disabled={!isFlaggable}
                onClick={handleFlagging}
              >
                Flag for review
              </Button>
              <Button
                color="success"
                onClick={handleReceive}
              >
                Shipment received
              </Button>
            </CardBody>
          </Card>
        );
      }
      case StateEnum.Flagged: {
        return (
          <Card>
            <CardBody>
              <CardTitle>[{product.id}] {product.name}</CardTitle>
              <CardSubtitle>Price: {weiToEther(product.price)} ether</CardSubtitle>
              <CardSubtitle>State: Received</CardSubtitle>
              <CardText>
                <i>Vendor: {product.Vendor}</i>
                <br />
                Waiting for admin review...
              </CardText>
            </CardBody>
          </Card>
        );
      }
      default: {
        return (<div />);
      }
    }
  }
  return (<div />);
};

export default PurchasedProduct;
