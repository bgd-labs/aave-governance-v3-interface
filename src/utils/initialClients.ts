import { PublicClient } from '@wagmi/core';

import { appUsedNetworks } from './appConfig';
import { CHAINS, createViemClient } from './chains';

export const initialClients: Record<number, PublicClient> = {};
appUsedNetworks.forEach((chain) => {
  initialClients[chain] = createViemClient(
    CHAINS[chain],
    CHAINS[chain].rpcUrls.public.http[0],
  );
});
