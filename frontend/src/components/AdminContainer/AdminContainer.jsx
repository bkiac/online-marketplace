import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';
import Admin from './Admin';

class AdminContainer extends Component {
  constructor(props, context) {
    super(props);

    const { drizzle: { contracts: { Market } } } = context;
    this.MarketContract = Market;

    const keyToOwner = this.MarketContract.methods.owner.cacheCall();
    const keyToIsDevelopmentMode = this.MarketContract.methods.isDevelopmentMode.cacheCall();
    const keyToPaused = this.MarketContract.methods.paused.cacheCall();

    this.dataKeys = {
      owner: keyToOwner,
      isDevelopmentMode: keyToIsDevelopmentMode,
      paused: keyToPaused,
    };

    this.isAccountTheOwner = this.isAccountTheOwner.bind(this);
    this.handleDevMode = this.handleDevMode.bind(this);
    this.handlePause = this.handlePause.bind(this);
  }

  isAccountTheOwner() {
    const { account, Market: MarketState } = this.props;

    const owner = MarketState.owner[this.dataKeys.owner].value;

    return owner === account;
  }

  handleDevMode() {
    if (!this.isAccountTheOwner()) {
      return;
    }

    const { Market: MarketState } = this.props;

    const isDevMode = MarketState.isDevelopmentMode[this.dataKeys.isDevelopmentMode].value;

    if (isDevMode) {
      this.MarketContract.methods.setProductionMode.cacheSend();
    } else {
      this.MarketContract.methods.setDevelopmentMode.cacheSend();
    }
  }

  handlePause() {
    if (!this.isAccountTheOwner()) {
      return;
    }

    const { Market: MarketState } = this.props;

    const isPaused = MarketState.paused[this.dataKeys.paused].value;

    console.log(this.MarketContract);

    if (isPaused) {
      this.MarketContract.methods.unpause.cacheSend();
    } else {
      this.MarketContract.methods.pause.cacheSend();
    }
  }

  render() {
    const { Market: MarketState } = this.props;

    if (this.dataKeys.owner in MarketState.owner
      && this.dataKeys.isDevelopmentMode in MarketState.isDevelopmentMode
      && this.dataKeys.paused in MarketState.paused) {
      if (this.isAccountTheOwner()) {
        const isDevMode = MarketState.isDevelopmentMode[this.dataKeys.isDevelopmentMode].value;
        const isPaused = MarketState.paused[this.dataKeys.paused].value;

        return (
          <Admin
            hasLoaded
            isUserTheOwner
            isDevMode={isDevMode}
            isPaused={isPaused}
            handleDevMode={this.handleDevMode}
            handlePause={this.handlePause}
          />
        );
      }

      return (
        <Admin
          hasLoaded
          isUserTheOwner={false}
        />
      );
    }

    return (
      <Admin
        hasLoaded={false}
      />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
  Market: state.contracts.Market,
});

AdminContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(AdminContainer, mapStateToProps);
