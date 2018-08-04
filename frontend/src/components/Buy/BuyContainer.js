import { drizzleConnect } from 'drizzle-react';

import Buy from './Buy';

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});

const BuyContainer = drizzleConnect(Buy, mapStateToProps);

export default BuyContainer;
