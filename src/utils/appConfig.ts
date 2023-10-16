import {
  appConfigInit,
  CoreNetworkName,
  payloadsControllerChainIds,
  votingMachineChainIds,
} from '@bgd-labs/aave-governance-ui-helpers/src/helpers/appConfig';
import { ChainIdByName } from '@bgd-labs/aave-governance-ui-helpers/src/helpers/chains';

export const isForIPFS = process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS === 'true';
export const isTermsAndConditionsVisible =
  process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_VISIBLE === 'true';

export const coreName: CoreNetworkName = 'sepolia';
export const WC_PROJECT_ID =
  process.env.WC_PROJECT_ID || 'e6ed0c48443e54cc875462bbaec6e3a7'; // https://docs.walletconnect.com/2.0/cloud/relay

// @ts-ignore
export const isTestnet = coreName === 'goerli' || coreName === 'sepolia';

export const appUsedNetworks: ChainIdByName[] = [
  ...votingMachineChainIds[coreName],
  ...payloadsControllerChainIds[coreName],
].filter((value, index, self) => self.indexOf(value) === index);

export const appConfig = appConfigInit(coreName);
