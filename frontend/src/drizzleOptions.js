import MarketHelper from '../../backend/build/contracts/MarketHelper.json';
import EscrowFactory from '../../backend/build/contracts/EscrowFactory.json';
import Market from '../../backend/build/contracts/Market.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545',
    },
  },
  contracts: [
    MarketHelper,
    EscrowFactory,
    Market,
  ],
  events: {
    SimpleStorage: ['StorageSet'],
  },
  polls: {
    accounts: 1500,
  },
};

export default drizzleOptions;
