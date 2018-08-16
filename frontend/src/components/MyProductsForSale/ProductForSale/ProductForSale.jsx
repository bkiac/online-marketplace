import React from 'react';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import moment from 'moment';

import StateEnum from '../../../util/StateEnum';
import { weiToEther } from '../../../util/helpers';

const ProductForSale = ({ product, escrow, isWithdrawable, handleShipping, handleWithdraw }) => {
  if (product) {
    switch (product.state) {
      case StateEnum.New: {
        return (
          <Card>
            <CardBody>
              <CardTitle>[{product.id}] {product.name}</CardTitle>
              <CardSubtitle>Price: {weiToEther(product.price)} ether</CardSubtitle>
              <CardSubtitle>State: New</CardSubtitle>
              <CardText>
                <i>Customer: none</i>
              </CardText>
            </CardBody>
          </Card>
        );
      }
      case StateEnum.Purchased: {
        return (
          <Card>
            <CardBody>
              <CardTitle>[{product.id}] {product.name}</CardTitle>
              <CardSubtitle>Price: {weiToEther(product.price)} ether</CardSubtitle>
              <CardSubtitle>State: Purchased</CardSubtitle>
              <CardText>
                <i>Customer: {product.customer}</i>
                <br />
                You have to ship the product until {
                moment(escrow.expirationDate * 1000).add(3, 'days').format('YYYY-MM-DD HH:mm')
              }.
                <br />
                You set the guaranteed shipping time to {product.guaranteedShippingTime} days.
              </CardText>
              <Button
                color="primary"
                onClick={handleShipping}
              >
                Ship
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
                <i>Customer: {product.customer}</i>
                <br />
                You can withdraw from the escrow if the product is received or at latest {
                moment(escrow.expirationDate * 1000).add(3, 'days').format('YYYY-MM-DD HH:mm')
              }
              </CardText>
              <Button
                color={isWithdrawable ? 'success' : 'secondary'}
                disabled={!isWithdrawable}
                onClick={handleWithdraw}
              >
                Withdraw from escrow
              </Button>
            </CardBody>
          </Card>
        );
      }
      case StateEnum.Received: {
        if (Number.parseInt(escrow.amountHeld) !== 0) {
          return (
            <Card>
              <CardBody>
                <CardTitle>[{product.id}] {product.name}</CardTitle>
                <CardSubtitle>Price: {weiToEther(product.price)} ether</CardSubtitle>
                <CardSubtitle>State: Received</CardSubtitle>
                <CardText>
                  <i>Customer: {product.customer}</i>
                </CardText>
                <Button
                  color="success"
                  onClick={handleWithdraw}
                >
                  Withdraw from escrow
                </Button>
              </CardBody>
            </Card>
          );
        }

        return (
          <div />
        );
      }
      default: {
        return (<div />);
      }
    }
  }
  return (<div />);
};

export default ProductForSale;
