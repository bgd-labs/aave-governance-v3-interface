import { Address, zeroAddress } from 'viem';

import { IEnsSlice } from '../../web3/store/ensSlice';
import { IDelegationSlice } from './delegationSlice';

export function getToAddress(activeAddress: Address, toAddress: Address) {
  if (toAddress === activeAddress || toAddress === zeroAddress) {
    return '';
  } else if (!!toAddress) {
    return toAddress;
  }
  return '';
}

export const selectDelegateToAddress = async ({
  store,
  activeAddress,
  addressTo,
}: {
  store: IDelegationSlice & IEnsSlice;
  activeAddress: Address;
  addressTo: Address | string;
}) => {
  // check is address `to` not ens name
  if (addressTo.startsWith('0x')) {
    return addressTo as Address;
  } else {
    // get address `to` from ens name
    const addressFromENSName = await store.fetchAddressByEnsName(addressTo);
    if (addressFromENSName) {
      if (addressFromENSName.toLowerCase() === activeAddress.toLowerCase()) {
        return '';
      } else {
        return addressFromENSName;
      }
    } else {
      return '';
    }
  }
};
