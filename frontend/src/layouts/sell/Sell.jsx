import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import Web3 from 'web3';

class Sell extends Component {
  constructor(props, context) {
    super(props);

    this.contracts = context.drizzle.contracts;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      name: '',
      price: 0,
      guaranteedShippingTime: 0,
    };

    console.log(this.state);
    console.log(this.props);
    console.log(context);
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });

    console.log(this.state);
  }

  handleSubmit() {
    const { name, price, guaranteedShippingTime } = this.state;
    const { Market } = this.contracts;

    console.log('Creating product:');
    console.log({
      name,
      price,
      guaranteedShippingTime,
    });

    Market.methods.createListing(
      name,
      Web3.utils.toWei(price.toString(), 'ether'),
      guaranteedShippingTime,
    ).send();
  }

  render() {
    return (
      <Container>
        <Row>
          <Col
            sm="12"
            md={{ size: 8, offset: 2 }}
          >
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name of the product"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="price">Price</Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Price in ether"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="guaranteedShippingTime">Guaranteed shipping time</Label>
                <Input
                  type="number"
                  name="guaranteedShippingTime"
                  id="guaranteedShippingTime"
                  placeholder="Guaranteed shipping time"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <Button onClick={this.handleSubmit}>Create Listing</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

Sell.contextTypes = {
  drizzle: PropTypes.object,
};

export default Sell;
