import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Sell from './Sell';
import { etherToWei } from '../../util/helpers';

class SellContainer extends Component {
  constructor(props, context) {
    super(props);

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    this.keyToConflictPeriod = this.MarketContract.methods.isDevelopmentMode.cacheCall();

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
    const { name, price, guaranteedShippingTime, Market: MarketState } = this.state;
    const { Market } = this.contracts;

    let gtsInSeconds = moment.duration(3, 'days').asSeconds();
    if (MarketState.isDevelopmentMode[this.keyToConflictPeriod].value) {
      gtsInSeconds = moment.duration(guaranteedShippingTime, 'minutes').asSeconds();
    } else {
      gtsInSeconds = moment.duration(guaranteedShippingTime, 'days').asSeconds();
    }

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
  drizzleStatus: state.drizzleStatus,
  accounts: state.accounts,
  Market: state.contract.Market,
});

SellContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(SellContainer, mapStateToProps);
