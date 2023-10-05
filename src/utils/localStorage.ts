import { AppProviderStorage } from '../rpcSwitcher/store/providerSlice';
import { EnsDataItem } from '../web3/store/ensSlice';

export enum LocalStorageKeys {
  EnsAddresses = 'EnsAddresses',
  RpcUrls = 'RpcUrls',
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

export const getLocalStorageRpcUrls = () => {
  if (typeof window !== 'undefined') {
    return localStorage?.getItem(LocalStorageKeys.RpcUrls);
  }
};

export const setLocalStorageRpcUrls = (
  rpcUrls: Record<number, AppProviderStorage>,
) => {
  if (typeof window !== 'undefined') {
    localStorage?.setItem(LocalStorageKeys.RpcUrls, JSON.stringify(rpcUrls));
  }
};
