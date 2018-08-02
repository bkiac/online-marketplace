import { drizzleConnect } from 'drizzle-react';

import Sell from './Sell';

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});

const SellContainer = drizzleConnect(Sell, mapStateToProps);

export default SellContainer;
