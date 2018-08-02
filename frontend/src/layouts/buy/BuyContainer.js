import { drizzleConnect } from 'drizzle-react';

import Buy from './Buy';

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});

const BuyContainer = drizzleConnect(Buy, mapStateToProps);

export default BuyContainer;
