import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import Navigation from './Navigation';

class NavigationContainer extends Component {
  constructor(props, context) {
    super(props);

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    this.keyToOwner = this.MarketContract.methods.owner.cacheCall();

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    const { isOpen } = this.state;

    this.setState({
      isOpen: !isOpen,
    });
  }

  render() {
    const { isOpen } = this.state;
    const { account, Market: MarketState } = this.props;

    let isOwner = false;
    if (this.keyToOwner in MarketState.owner) {
      const ownerAddress = MarketState.owner[this.keyToOwner].value;
      isOwner = ownerAddress === account;
    }

    return (
      <Navigation
        isOpen={isOpen}
        account={account}
        isOwner={isOwner}
        toggle={this.toggle}
      />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
  Market: state.contracts.Market,
});

NavigationContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(NavigationContainer, mapStateToProps);
