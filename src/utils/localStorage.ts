import { EnsDataItem } from '../web3/store/ensSlice';

export enum LocalStorageKeys {
  EnsAddresses = 'EnsAddresses',
}

export const getLocalStorageEnsAddresses = () => {
  if (typeof window !== 'undefined') {
    return localStorage?.getItem(LocalStorageKeys.EnsAddresses);
  }
};

export const setLocalStorageEnsAddresses = (
  ensAddresses: Record<string, EnsDataItem>,
) => {
  if (typeof window !== 'undefined') {
    localStorage?.setItem(
      LocalStorageKeys.EnsAddresses,
      JSON.stringify(ensAddresses),
    );
  }
};
