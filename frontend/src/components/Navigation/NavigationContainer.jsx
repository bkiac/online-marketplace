import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';

import Navigation from './Navigation';

class NavigationContainer extends Component {
  constructor(props) {
    super(props);

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
    const { account } = this.props;

    return (
      <Navigation
        isOpen={isOpen}
        account={account}
        toggle={this.toggle}
      />
    );
  }
}

const mapStateToProps = state => ({
  drizzleStatus: state.drizzleStatus,
  account: state.accounts[0],
});

export default drizzleConnect(NavigationContainer, mapStateToProps);
