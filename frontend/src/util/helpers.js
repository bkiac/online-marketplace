import Web3 from 'web3';
import StateEnum from './StateEnum';

export function etherToWei(etherAmount) {
  return Web3.utils.toWei(etherAmount.toString(), 'ether');
}

export function weiToEther(weiAmount) {
  return Web3.utils.fromWei(weiAmount.toString(), 'ether');
}

export function filterProductsByState(products, state) {
  return products.filter(p => (
    p.state === StateEnum[state]
  ));
}

function filterProductsByAddress(products, field, address) {
  return products.filter(p => (
    p[field] === address
  ));
}

export function filterProductsByVendor(products, vendorAddress) {
  return filterProductsByAddress(products, 'vendor', vendorAddress);
}

export function filterProductsByCustomer(products, customerAddress) {
  return filterProductsByAddress(products, 'customer', customerAddress);
}

export function values(obj) {
  return Object.keys(obj).map(key => (obj[key].value));
}

// TODO: use Higher-Order Component
export function getProductKeysFromCache(MarketState, MarketContract) {
  const keyToNumOfProducts = MarketContract.methods.numOfProducts.cacheCall();

  const keysToProducts = [];
  if (keyToNumOfProducts in MarketState.numOfProducts) {
    const numOfProducts = Number.parseInt(MarketState.numOfProducts[keyToNumOfProducts].value);

    for (let i = 0; i < numOfProducts; i += 1) {
      keysToProducts.push(MarketContract.methods.products.cacheCall(i));
    }
  }

  return {
    numOfProducts: keyToNumOfProducts,
    products: keysToProducts,
  };
}
