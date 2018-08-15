import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Sell from './Sell';
import { etherToWei } from '../../util/helpers';

class SellContainer extends Component {
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
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit() {
    const { name, price, guaranteedShippingTime } = this.state;
    const { Market } = this.contracts;

    // TODO: prod mode
    const gtsInSeconds = moment.duration(guaranteedShippingTime, 'minutes').asSeconds();
    // const gtsInSeconds = moment.duration(guaranteedShippingTime, 'days').asSeconds();

    Market.methods.createProductListing.cacheSend(
      name,
      etherToWei(price),
      gtsInSeconds,
    );
  }

  render() {
    return (
      <Sell
        handleInputChange={this.handleInputChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});

SellContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(SellContainer, mapStateToProps);
