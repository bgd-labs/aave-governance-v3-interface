import {
  appConfigInit,
  CoreNetworkName,
  payloadsControllerChainIds,
  votingMachineChainIds,
} from '@bgd-labs/aave-governance-ui-helpers';
import { avalanche, goerli, polygon, sepolia } from 'viem/chains';

export const isForIPFS = process.env.NEXT_PUBLIC_DEPLOY_FOR_IPFS === 'true';
export const isTermsAndConditionsVisible =
  process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_VISIBLE === 'true';

export const coreName: CoreNetworkName = 'mainnet';
export const WC_PROJECT_ID =
  process.env.WC_PROJECT_ID || 'e6ed0c48443e54cc875462bbaec6e3a7'; // https://docs.walletconnect.com/2.0/cloud/relay

export const appUsedNetworks: number[] = [
  ...votingMachineChainIds[coreName],
  ...payloadsControllerChainIds[coreName],
].filter((value, index, self) => self.indexOf(value) === index);

export const gelatoApiKeys: Record<number, string> = {
  [polygon.id]: 'eyUjscMpge_d3qScFe2ueftb95FDZ1eChyDJGqPx2uQ_',
  [avalanche.id]: 'iGCOci5z6zZYDDQ1p916xsKmr2pfP5o1EAQcRhy1_fI_',
  // testnets
  [goerli.id]: 'MgZBKc6a7GHzxlrkdHCWIsazai_Niqbps42wvPlE7xE_',
  [sepolia.id]: 'MgZBKc6a7GHzxlrkdHCWIsazai_Niqbps42wvPlE7xE_',
};

export const appConfig = appConfigInit(coreName);
