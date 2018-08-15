import React from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';

const Sell = ({ handleInputChange, handleSubmit }) => (
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
              maxLength="60"
              placeholder="Name of the product"
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              type="number"
              name="price"
              id="price"
              placeholder="Price in ether"
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="guaranteedShippingTime">Guaranteed shipping time</Label>
            <Input
              type="number"
              name="guaranteedShippingTime"
              id="guaranteedShippingTime"
              placeholder="Guaranteed shipping time"
              onChange={handleInputChange}
            />
          </FormGroup>
          <Button onClick={handleSubmit}>Create Listing</Button>
        </Form>
      </Col>
    </Row>
  </Container>
);

export default Sell;
