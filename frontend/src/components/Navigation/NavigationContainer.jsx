import React, { Component } from 'react';

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

    this.state.isOpen = !isOpen;
  }

  render() {
    const { isOpen } = this.state;

    return (
      <Navigation
        isOpen={isOpen}
        toggle={this.toggle}
      />
    );
  }
}

export default NavigationContainer;
