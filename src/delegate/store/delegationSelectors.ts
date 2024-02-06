import { Address, zeroAddress } from 'viem';

export function getToAddress(activeAddress: Address, toAddress: Address) {
  if (toAddress === activeAddress || toAddress === zeroAddress) {
    return '';
  } else if (!!toAddress) {
    return toAddress;
  }
  return '';
}
