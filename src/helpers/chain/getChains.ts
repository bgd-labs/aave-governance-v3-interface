import { Chain } from 'viem';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  bscTestnet,
  gnosis,
  mainnet,
  metis,
  optimism,
  polygon,
  polygonMumbai,
  scroll,
  sepolia,
  zkSync,
} from 'viem/chains';

import { CreateViemClientParams } from './createClient';
import { setChain } from './setChain';

export function getChains({
  initialRpcUrls,
}: Pick<CreateViemClientParams, 'initialRpcUrls'>) {
  return {
    [mainnet.id]: setChain({ chain: mainnet, initialRpcUrls }),
    [polygon.id]: setChain({ chain: polygon, initialRpcUrls }),
    [avalanche.id]: setChain({ chain: avalanche, initialRpcUrls }),
    [bsc.id]: setChain({ chain: bsc, initialRpcUrls }),
    [base.id]: setChain({ chain: base, initialRpcUrls }),
    [arbitrum.id]: setChain({ chain: arbitrum, initialRpcUrls }),
    [metis.id]: setChain({ chain: metis, initialRpcUrls }),
    [optimism.id]: setChain({ chain: optimism, initialRpcUrls }),
    [gnosis.id]: setChain({ chain: gnosis, initialRpcUrls }),
    [scroll.id]: setChain({ chain: scroll, initialRpcUrls }),
    [zkSync.id]: setChain({ chain: zkSync, initialRpcUrls }),
    // testnets
    [sepolia.id]: setChain({ chain: sepolia, initialRpcUrls }),
    [polygonMumbai.id]: setChain({ chain: polygonMumbai, initialRpcUrls }),
    [avalancheFuji.id]: setChain({ chain: avalancheFuji, initialRpcUrls }),
    [bscTestnet.id]: setChain({ chain: bscTestnet, initialRpcUrls }),
  } as Record<number, Chain>;
}
