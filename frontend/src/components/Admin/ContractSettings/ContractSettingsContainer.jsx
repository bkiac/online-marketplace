import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { drizzleConnect } from 'drizzle-react';

import ContractSettings from './ContractSettings';

class ContractSettingsContainer extends Component {
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
          <ContractSettings
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
        <ContractSettings
          hasLoaded
          isUserTheOwner={false}
        />
      );
    }

    return (
      <ContractSettings
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

ContractSettingsContainer.contextTypes = {
  drizzle: PropTypes.object,
};

export default drizzleConnect(ContractSettingsContainer, mapStateToProps);
