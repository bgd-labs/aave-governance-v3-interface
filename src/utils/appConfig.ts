import {
  appConfigInit,
  ChainIdByName,
  CoreNetworkName,
  payloadsControllerChainIds,
  votingMachineChainIds,
} from '../../lib/helpers/src';
import { StaticJsonRpcBatchProvider } from '../../lib/web3/src/utils/StaticJsonRpcBatchProvider';
import { chainInfoHelper } from './configs';

export const isForIPFS = process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS === 'true';

export const coreName: CoreNetworkName = 'sepolia';
export const WC_PROJECT_ID = 'e6ed0c48443e54cc875462bbaec6e3a7'; // https://docs.walletconnect.com/2.0/cloud/relay

// @ts-ignore
export const isTestnet = coreName === 'goerli' || coreName === 'sepolia';

const appUsedNetworks: ChainIdByName[] = [
  ...votingMachineChainIds[coreName],
  ...payloadsControllerChainIds[coreName],
].filter((value, index, self) => self.indexOf(value) === index);

const providers: Record<number, StaticJsonRpcBatchProvider> = {};
appUsedNetworks.forEach((chain) => {
  providers[chain] = chainInfoHelper.providerInstances[chain].instance;
});

export const appConfig = appConfigInit(providers, coreName);
