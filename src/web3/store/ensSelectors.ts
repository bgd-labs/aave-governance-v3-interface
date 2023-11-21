import dayjs from 'dayjs';
import { Hex } from 'viem';

import { ENS_TTL } from '../utils/ensHelpers';
import { ENSProperty, IEnsSlice } from './ensSlice';

export const ENSDataExists = (
  store: IEnsSlice,
  address: Hex,
  property: ENSProperty,
) => {
  const lowercasedAddress = address.toLocaleLowerCase() as Hex;
  return Boolean(
    store.ensData[lowercasedAddress] &&
      store.ensData[lowercasedAddress][property],
  );
};

export const ENSDataHasBeenFetched = (
  store: IEnsSlice,
  address: Hex,
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
      store.ensData[address.toLocaleLowerCase() as Hex].name === name,
  );
};

export const selectENSAvatar = (
  store: IEnsSlice,
  address: Hex,
  setAvatar: (value: string | undefined) => void,
  setIsAvatarExists: (value: boolean | undefined) => void,
) => {
  const lowercasedAddress = address.toLocaleLowerCase() as Hex;
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
