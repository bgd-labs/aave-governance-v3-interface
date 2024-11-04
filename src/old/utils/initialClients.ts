import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';

import { appUsedNetworks } from './appConfig';
import { CHAINS, createViemClient } from './chains';

export const initialClients: ClientsRecord = {};
appUsedNetworks.forEach((chain) => {
  initialClients[chain] = createViemClient(
    CHAINS[chain],
    CHAINS[chain].rpcUrls.default.http[0],
  );
});
