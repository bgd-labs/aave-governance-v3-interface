import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { ChainId, getRPCUrl } from '@bgd-labs/rpc-env';

import { env } from '../../env';
import { createViemClient } from '../../helpers/chain/createClient';
import { getChains } from '../../helpers/chain/getChains';
import { getInitialRpcUrls } from '../../helpers/chain/getInitialRpcUrls';

const initialRpcUrls = getInitialRpcUrls({
  mainnetRPC: getRPCUrl(ChainId.mainnet, { alchemyKey: env.ALCHEMY_API_KEY }),
  polygonRPC: getRPCUrl(ChainId.polygon, { alchemyKey: env.ALCHEMY_API_KEY }),
  avalancheRPC: getRPCUrl(ChainId.avalanche, {
    alchemyKey: env.ALCHEMY_API_KEY,
  }),
  bscRPC: getRPCUrl(ChainId.bnb, { alchemyKey: env.ALCHEMY_API_KEY }),
  baseRPC: getRPCUrl(ChainId.base, { alchemyKey: env.ALCHEMY_API_KEY }),
  arbitrumRPC: getRPCUrl(ChainId.arbitrum, { alchemyKey: env.ALCHEMY_API_KEY }),
  metisRPC: getRPCUrl(ChainId.metis, { alchemyKey: env.ALCHEMY_API_KEY }),
  optimismRPC: getRPCUrl(ChainId.optimism, { alchemyKey: env.ALCHEMY_API_KEY }),
  gnosisRPC: getRPCUrl(ChainId.gnosis, { alchemyKey: env.ALCHEMY_API_KEY }),
  scrollRPC: getRPCUrl(ChainId.scroll, { alchemyKey: env.ALCHEMY_API_KEY }),
  zkSyncRPC: getRPCUrl(ChainId.zksync, { alchemyKey: env.ALCHEMY_API_KEY }),
  lineaRPC: getRPCUrl(ChainId.linea, { alchemyKey: env.ALCHEMY_API_KEY }),
});
const serverChains = getChains({ initialRpcUrls });
export const serverClients: ClientsRecord = {};
Object.values(serverChains).forEach((chain) => {
  serverClients[chain.id] = createViemClient({
    chain: chain,
    initialRpcUrls,
  });
});
