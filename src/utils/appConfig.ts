import {
  appConfigInit,
  ChainIdByName,
  payloadsControllerChainIds,
  providers as baseProviders,
  votingMachineChainIds,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StaticJsonRpcBatchProvider } from '@bgd-labs/frontend-web3-utils';

import { coreName } from './coreName';

export const isForIPFS = process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS === 'true';

export const WC_PROJECT_ID = 'e6ed0c48443e54cc875462bbaec6e3a7'; // https://docs.walletconnect.com/2.0/cloud/relay

// @ts-ignore
export const isTestnet = coreName === 'goerli' || coreName === 'sepolia';

const appUsedNetworks: ChainIdByName[] = [
  ...votingMachineChainIds[coreName],
  ...payloadsControllerChainIds[coreName],
].filter((value, index, self) => self.indexOf(value) === index);

const providers: Record<number, StaticJsonRpcBatchProvider> = {};
appUsedNetworks.forEach((chain) => {
  // TODO: need fix
  // @ts-ignore
  providers[chain] = baseProviders[chain];
});

export const appConfig = appConfigInit(providers, coreName);
