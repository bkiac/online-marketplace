import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';

import Navigation from './Navigation';

class NavigationContainer extends Component {
  constructor(props) {
    super(props);

    const { accounts } = this.props;

    this.toggle = this.toggle.bind(this);

    this.state = {
      account: accounts[0],
      isOpen: false,
    };
  }

  toggle() {
    const { isOpen } = this.state;

    this.state.isOpen = !isOpen;
  }

  render() {
    const { isOpen, account } = this.state;

    return (
      <Navigation
        isOpen={isOpen}
        toggle={this.toggle}
        account={account}
      />
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});

export default drizzleConnect(NavigationContainer, mapStateToProps);
