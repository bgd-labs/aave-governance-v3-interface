import { initChainInformationConfig } from '@bgd-labs/frontend-web3-utils';

import { getChains } from '../helpers/chain/getChains';
import { getInitialRpcUrls } from '../helpers/chain/getInitialRpcUrls';

export const initialRpcUrls = getInitialRpcUrls({
  mainnetRPC: process.env.NEXT_PUBLIC_RPC_MAINNET,
  polygonRPC: process.env.NEXT_PUBLIC_RPC_POLYGON,
  avalancheRPC: process.env.NEXT_PUBLIC_RPC_AVALANCHE,
  // TIP: The new private RPC url's for the client is specified here (getting from client env). They are only needed for those networks where voting can take place.
  // example: exampleRPC: process.env.NEXT_PUBLIC_RPC_EXAMPLE,
});
export const CHAINS = getChains({ initialRpcUrls });

export const chainInfoHelper = initChainInformationConfig(CHAINS);
