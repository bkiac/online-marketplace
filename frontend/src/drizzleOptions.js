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
    Market,
  ],
  events: {
  },
  polls: {
    accounts: 1500,
  },
};

export default drizzleOptions;
