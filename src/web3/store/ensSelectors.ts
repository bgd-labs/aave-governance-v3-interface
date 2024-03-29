import dayjs from 'dayjs';
import { Address, isAddress } from 'viem';

import { RootState } from '../../store';
import { ENS_TTL, isEnsName } from '../utils/ensHelpers';
import { ENSProperty, IEnsSlice } from './ensSlice';

export const ENSDataExists = (
  store: IEnsSlice,
  address: Address | string,
  property: ENSProperty,
) => {
  const lowercasedAddress = address.toLocaleLowerCase() as Address;
  return Boolean(
    store.ensData[lowercasedAddress] &&
      store.ensData[lowercasedAddress][property],
  );
};

export const ENSDataHasBeenFetched = (
  store: IEnsSlice,
  address: Address,
  property: ENSProperty,
) => {
  const currentTime = dayjs().unix();
  const fetchTime = store.ensData[address]?.fetched?.[property];
  if (!fetchTime) return false;

  return currentTime - fetchTime <= ENS_TTL;
};

export const checkIsGetAddressByENSNamePending = (
  store: IEnsSlice,
  name: string,
) => {
  return store.addressesNameInProgress[name] || false;
};

export const getAddressByENSNameIfExists = (store: IEnsSlice, name: string) => {
  return Object.keys(store.ensData).find(
    (address) =>
      store.ensData[address.toLocaleLowerCase() as Address].name === name,
  );
};

export const selectENSAvatar = (
  store: IEnsSlice,
  address: Address,
  setAvatar: (value: string | undefined) => void,
  setIsAvatarExists: (value: boolean | undefined) => void,
) => {
  const lowercasedAddress = address.toLocaleLowerCase() as Address;
  const ENSData = store.ensData[lowercasedAddress];

  if (ENSData && ENSData.name) {
    store.fetchEnsAvatarByAddress(address, ENSData.name).then(() => {
      setAvatar(
        ENSDataExists(store, address, ENSProperty.AVATAR)
          ? store.ensData[lowercasedAddress].avatar?.url
          : undefined,
      );
      setIsAvatarExists(store.ensData[lowercasedAddress].avatar?.isExists);
    });
  } else {
    setAvatar(undefined);
    setIsAvatarExists(false);
  }
};

export const selectInputToAddress = async ({
  store,
  activeAddress,
  addressTo,
}: {
  store: IEnsSlice;
  activeAddress: Address;
  addressTo: Address | string;
}) => {
  // check is address `to` not ens name
  if (isAddress(addressTo)) {
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

export const checkIfAddressENS = (
  store: RootState,
  activeWalletAddress: Address,
  address?: Address | string,
) => {
  if (
    address === undefined ||
    address.toLowerCase() === activeWalletAddress.toLowerCase()
  ) {
    return '';
  } else if (isEnsName(address)) {
    const addressFromENS = getAddressByENSNameIfExists(store, address);
    if (addressFromENS) {
      if (addressFromENS?.toLowerCase() === activeWalletAddress.toLowerCase()) {
        return '';
      } else {
        return addressFromENS;
      }
    } else {
      return address;
    }
  } else {
    return address;
  }
};
