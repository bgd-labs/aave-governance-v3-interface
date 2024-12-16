import { getChains } from '../utils/getChains';
import { getInitialRpcUrls } from '../utils/getInitialRpcUrls';

export const initialRpcUrls = getInitialRpcUrls({
  mainnetRPC: process.env.NEXT_PUBLIC_RPC_MAINNET,
  polygonRPC: process.env.NEXT_PUBLIC_RPC_POLYGON,
  avalancheRPC: process.env.NEXT_PUBLIC_RPC_AVALANCHE,
});
export const CHAINS = getChains({ initialRpcUrls });
