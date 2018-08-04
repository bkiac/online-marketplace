/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';
import 'bootstrap/dist/css/bootstrap.css';

import store from './store';
import drizzleOptions from './drizzleOptions';

// Layouts
import App from './App';
import { BuyContainer } from './components/Buy';
import { SellContainer } from './components/Sell';
import { NavigationContainer } from './components/Navigation';

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  (
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <div>
          <NavigationContainer/>
          <Router history={history}>
            <Route path="/" component={App}>
              <IndexRoute component={BuyContainer}/>
            </Route>
            <Route path="/buy" component={BuyContainer}/>
            <Route path="/sell" component={SellContainer}/>
          </Router>
        </div>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root'),
);
