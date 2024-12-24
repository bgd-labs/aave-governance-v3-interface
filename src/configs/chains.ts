import { getChains } from '../helpers/chain/getChains';
import { getInitialRpcUrls } from '../helpers/chain/getInitialRpcUrls';

export const initialRpcUrls = getInitialRpcUrls({
  mainnetRPC: process.env.NEXT_PUBLIC_RPC_MAINNET,
  polygonRPC: process.env.NEXT_PUBLIC_RPC_POLYGON,
  avalancheRPC: process.env.NEXT_PUBLIC_RPC_AVALANCHE,
});
export const CHAINS = getChains({ initialRpcUrls });
