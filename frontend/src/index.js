import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';
import 'bootstrap/dist/css/bootstrap.css';

import store from './store';
import drizzleOptions from './drizzleOptions';

import { NavigationContainer } from './components/Navigation';
import { SellContainer } from './components/Sell';
import { BuyContainer } from './components/Buy';
import { MyProductsForSaleContainer } from './components/MyProductsForSale';
import { MyPurchasedProductsContainer } from './components/MyPurchasedProducts';
import { ContractSettingsContainer } from './components/Admin/ContractSettings';
import { ProductDisputesContainer } from './components/Admin/ProductDisputes';

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

/* eslint-disable */
ReactDOM.render(
  (
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <div>
          <NavigationContainer />
          <Router history={history}>
            <Route path="/" component={BuyContainer} />
            <Route path="/admin/contract-settings" component={ContractSettingsContainer} />
            <Route path="/admin/product-disputes" component={ProductDisputesContainer} />
            <Route path="/buy" component={BuyContainer} />
            <Route path="/sell" component={SellContainer} />
            <Route path="/my-products-for-sale" component={MyProductsForSaleContainer} />
            <Route path="/my-purchased-products" component={MyPurchasedProductsContainer} />
          </Router>
        </div>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root'),
);
