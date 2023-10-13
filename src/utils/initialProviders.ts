import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils/src/utils/StaticJsonRpcBatchProvider';

import { appUsedNetworks } from './appConfig';
import { chainInfoHelper } from './configs';

export const initialProviders: Record<number, StaticJsonRpcBatchProvider> = {};
appUsedNetworks.forEach((chain) => {
  initialProviders[chain] = chainInfoHelper.providerInstances[chain].instance;
});
