import { PublicClient } from '@wagmi/core';
import { createPublicClient, fallback, http } from 'viem';

import { appUsedNetworks } from './appConfig';
import { CHAINS, fallBackConfig, initialRpcUrls } from './chains';

export const initialClients: Record<number, PublicClient> = {};
appUsedNetworks.forEach((chain) => {
  initialClients[chain] = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: CHAINS[chain],
    transport: fallback(
      initialRpcUrls[chain].map((url) => http(url)),
      fallBackConfig,
    ),
  });
});
