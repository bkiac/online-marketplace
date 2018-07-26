import { browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { generateContractsInitialState } from 'drizzle';

import reducer from './reducer';
import rootSaga from './rootSaga';
import drizzleOptions from './drizzleOptions';

// Redux DevTools

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line


const routingMiddleware = routerMiddleware(browserHistory);
const sagaMiddleware = createSagaMiddleware();

const initialState = {
  contracts: generateContractsInitialState(drizzleOptions),
};

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(applyMiddleware(
    thunkMiddleware,
    routingMiddleware,
    sagaMiddleware,
  )),
);

sagaMiddleware.run(rootSaga);

export default store;
