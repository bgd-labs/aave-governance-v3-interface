import { PublicClient } from '@wagmi/core';
import { createPublicClient, http } from 'viem';

import { appUsedNetworks } from './appConfig';
import { CHAINS } from './chains';

export const initialClients: Record<number, PublicClient> = {};
appUsedNetworks.forEach((chain) => {
  initialClients[chain] = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: CHAINS[chain],
    transport: http(),
  }) as PublicClient;
});
