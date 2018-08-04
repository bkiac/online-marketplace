import { drizzleConnect } from 'drizzle-react';

import Sell from './Sell';

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});

const SellContainer = drizzleConnect(Sell, mapStateToProps);

export default SellContainer;
