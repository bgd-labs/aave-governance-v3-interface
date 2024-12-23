import {
  LocalStorageKeys as Web3LocalStorageKeys,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';

import {
  AppClientsStorage,
  AppModeType,
  EnsDataItem,
  IsGaslessVote,
  RepresentativeAddress,
} from '../types';

export enum LocalStorageKeys {
  GaslessVote = 'isGaslessVote',
  TermsAccept = 'termsAccept',
  AppMode = 'appMode',
  EnsAddresses = 'EnsAddresses',
  RpcUrls = 'rpcs_urls_4',
  TutorialStartButtonClicked = 'tutorialStartButtonClicked',
  RepresentingAddresses = 'representingAddresses',
  PowersInfoClicked = 'powersInfoClicked',
  PayloadsExplorerView = 'payloadsExplorerView',
}

// for ENS
export const getLocalStorageEnsAddresses = () => {
  return localStorage?.getItem(LocalStorageKeys.EnsAddresses);
};

export const setLocalStorageEnsAddresses = (
  ensAddresses: Record<string, EnsDataItem>,
) => {
  localStorage?.setItem(
    LocalStorageKeys.EnsAddresses,
    JSON.stringify(ensAddresses),
  );
};

// for RPC switcher
export const getLocalStorageRpcUrls = () => {
  return localStorage?.getItem(LocalStorageKeys.RpcUrls);
};

export const setLocalStorageRpcUrls = (
  rpcUrls: Record<number, AppClientsStorage>,
) => {
  localStorage?.setItem(LocalStorageKeys.RpcUrls, JSON.stringify(rpcUrls));
};

// for UI
export const getLocalStorageLastConnectedWallet = () => {
  return localStorage?.getItem(Web3LocalStorageKeys.LastConnectedWallet) as
    | WalletType
    | undefined;
};

export const getLocalStorageGaslessVote = () => {
  return localStorage?.getItem(LocalStorageKeys.GaslessVote) as IsGaslessVote;
};

export const setLocalStorageGaslessVote = (value: IsGaslessVote) => {
  return localStorage?.setItem(LocalStorageKeys.GaslessVote, value);
};

export const getLocalStorageTermsAccept = () => {
  return localStorage?.getItem(LocalStorageKeys.TermsAccept);
};

export const setLocalStorageTermsAccept = (value: string) => {
  return localStorage?.setItem(LocalStorageKeys.TermsAccept, value);
};

export const getLocalStorageAppMode = () => {
  return localStorage?.getItem(LocalStorageKeys.AppMode) as AppModeType;
};

export const setLocalStorageAppMode = (value: AppModeType) => {
  return localStorage?.setItem(LocalStorageKeys.AppMode, value);
};

export const getLocalStorageTutorialStartButtonClicked = () => {
  return localStorage?.getItem(LocalStorageKeys.TutorialStartButtonClicked);
};

export const setLocalStorageTutorialStartButtonClicked = (value: string) => {
  return localStorage?.setItem(
    LocalStorageKeys.TutorialStartButtonClicked,
    value,
  );
};

// for representations
export const getLocalStorageRepresentingAddresses = () => {
  const addresses = localStorage?.getItem(
    LocalStorageKeys.RepresentingAddresses,
  );

  return (addresses ? JSON.parse(addresses) : {}) as Record<
    string,
    RepresentativeAddress
  >;
};

export const setLocalStorageRepresentingAddresses = (
  addresses: Record<string, RepresentativeAddress>,
) => {
  return localStorage?.setItem(
    LocalStorageKeys.RepresentingAddresses,
    JSON.stringify(addresses),
  );
};

// for current powers
export const getLocalStoragePowersInfoClicked = () => {
  return localStorage?.getItem(LocalStorageKeys.PowersInfoClicked);
};

export const setLocalStoragePowersInfoClicked = (value: string) => {
  return localStorage?.setItem(LocalStorageKeys.PowersInfoClicked, value);
};

// for payloads explorer
export const getLocalStoragePayloadsExplorerView = () => {
  return localStorage?.getItem(LocalStorageKeys.PayloadsExplorerView);
};

export const setLocalStoragePayloadsExplorerView = (value: string) => {
  return localStorage?.setItem(LocalStorageKeys.PayloadsExplorerView, value);
};
