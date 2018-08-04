import Web3 from 'web3';

export function etherToWei(etherAmount) {
  return Web3.utils.toWei(etherAmount.toString(), 'ether');
}

export function weiToEther(weiAmount) {
  return Web3.utils.fromWei(weiAmount.toString(), 'ether');
}
