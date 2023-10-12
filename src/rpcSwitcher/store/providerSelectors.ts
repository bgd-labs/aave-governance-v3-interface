import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils/src/utils/StaticJsonRpcBatchProvider';
import { ethers } from 'ethers';

import { IProviderSlice } from './providerSlice';

export const selectAppProviders = (store: IProviderSlice) => {
  return Object.entries(store.appProviders).reduce(
    (acc, [key, value]) => {
      acc[key] = value.instance;
      return acc;
    },
    {} as Record<
      string,
      StaticJsonRpcBatchProvider | ethers.providers.JsonRpcProvider
    >,
  );
};
