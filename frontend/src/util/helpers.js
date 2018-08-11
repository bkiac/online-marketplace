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
  return Object.keys(obj).map(k => (obj[k].value));
}
