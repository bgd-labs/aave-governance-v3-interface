import dayjs from 'dayjs';
import { Address, isAddress } from 'viem';

import { ENS_TTL, isEnsName } from '../../helpers/ensHelpers';
import { EnsDataItem, ENSProperty } from '../../types';
import { IEnsSlice } from '../ensSlice';

export const ENSDataExists = (
  ensData: Record<`0x${string}`, EnsDataItem>,
  address: Address | string,
  property: ENSProperty,
) => {
  const lowercasedAddress = address.toLocaleLowerCase() as Address;
  return Boolean(
    ensData[lowercasedAddress] && ensData[lowercasedAddress][property],
  );
};

export const ENSDataHasBeenFetched = (
  ensData: Record<`0x${string}`, EnsDataItem>,
  address: Address,
  property: ENSProperty,
) => {
  const currentTime = dayjs().unix();
  const fetchTime = ensData[address]?.fetched?.[property];
  if (!fetchTime) return false;

  return currentTime - fetchTime <= ENS_TTL;
};

export const checkIsGetAddressByENSNamePending = (
  addressesNameInProgress: Record<string, boolean>,
  name: string,
) => {
  return addressesNameInProgress[name] || false;
};

export const getAddressByENSNameIfExists = (
  ensData: Record<`0x${string}`, EnsDataItem>,
  name: string,
) => {
  return Object.keys(ensData).find(
    (address) => ensData[address.toLocaleLowerCase() as Address].name === name,
  );
};

export const selectENSAvatar = ({
  fetchEnsAvatarByAddress,
  ensData,
  address,
  setAvatar,
  setIsAvatarExists,
}: {
  fetchEnsAvatarByAddress: (address: Address, name?: string) => Promise<void>;
  ensData: Record<`0x${string}`, EnsDataItem>;
  address: Address;
  setAvatar: (value: string | undefined) => void;
  setIsAvatarExists: (value: boolean | undefined) => void;
}) => {
  const lowercasedAddress = address.toLocaleLowerCase() as Address;
  const ENSData = ensData[lowercasedAddress];

  if (ENSData && ENSData.name) {
    fetchEnsAvatarByAddress(address, ENSData.name).then(() => {
      setAvatar(
        ENSDataExists(ensData, address, ENSProperty.AVATAR)
          ? ensData[lowercasedAddress].avatar?.url
          : undefined,
      );
      setIsAvatarExists(ensData[lowercasedAddress].avatar?.isExists);
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
  ensData: Record<`0x${string}`, EnsDataItem>,
  activeWalletAddress: Address,
  address?: Address | string,
) => {
  if (
    address === undefined ||
    address.toLowerCase() === activeWalletAddress.toLowerCase()
  ) {
    return '';
  } else if (isEnsName(address)) {
    const addressFromENS = getAddressByENSNameIfExists(ensData, address);
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
