import { Client } from 'viem';

import { env } from '../../env';
import { createViemClient } from '../../utils/createClient';
import { getChains } from '../../utils/getChains';
import { getInitialRpcUrls } from '../../utils/getInitialRpcUrls';

const initialRpcUrls = getInitialRpcUrls({
  mainnetRPC: env.RPC_MAINNET,
  polygonRPC: env.RPC_POLYGON,
  avalancheRPC: env.RPC_AVALANCHE,
  bscRPC: env.RPC_BNB,
  baseRPC: env.RPC_BASE,
  arbitrumRPC: env.RPC_ARBITRUM,
  metisRPC: env.RPC_METIS,
  optimismRPC: env.RPC_OPTIMISM,
  gnosisRPC: env.RPC_GNOSIS,
  scrollRPC: env.RPC_SCROLL,
  zkSyncRPC: env.RPC_ZKSYNC,
});
const serverChains = getChains({ initialRpcUrls });
export const serverClients: Record<number, Client> = {};
Object.values(serverChains).forEach((chain) => {
  serverClients[chain.id] = createViemClient({
    chain: chain,
    initialRpcUrls,
  });
});
