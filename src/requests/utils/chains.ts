import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { ChainId, getRPCUrl } from '@bgd-labs/rpc-env';

import { createViemClient } from '../../helpers/chain/createClient';
import { getChains } from '../../helpers/chain/getChains';
import { getInitialRpcUrls } from '../../helpers/chain/getInitialRpcUrls';

const initialRpcUrls = getInitialRpcUrls({
  mainnetRPC: getRPCUrl(ChainId.mainnet),
  polygonRPC: getRPCUrl(ChainId.polygon),
  avalancheRPC: getRPCUrl(ChainId.avalanche),
  bscRPC: getRPCUrl(ChainId.bnb),
  baseRPC: getRPCUrl(ChainId.base),
  arbitrumRPC: getRPCUrl(ChainId.arbitrum),
  metisRPC: getRPCUrl(ChainId.metis),
  optimismRPC: getRPCUrl(ChainId.optimism),
  gnosisRPC: getRPCUrl(ChainId.gnosis),
  scrollRPC: getRPCUrl(ChainId.scroll),
  zkSyncRPC: getRPCUrl(ChainId.zksync),
  lineaRPC: getRPCUrl(ChainId.linea),
});
const serverChains = getChains({ initialRpcUrls });
export const serverClients: ClientsRecord = {};
Object.values(serverChains).forEach((chain) => {
  serverClients[chain.id] = createViemClient({
    chain: chain,
    initialRpcUrls,
  });
});
