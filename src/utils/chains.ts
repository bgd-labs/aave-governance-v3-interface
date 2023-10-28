// TODO: added fallback rpc urls to all chains

import { Chain } from 'viem';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  bscTestnet,
  goerli,
  mainnet,
  metis,
  optimism,
  polygon,
  polygonMumbai,
  sepolia,
} from 'viem/chains';

// chains information (RPC (urls), nativeCurrency, name, blockExplorerUrls)
export const initialRpcUrls: Record<number, string[]> = {
  [mainnet.id]: ['https://cloudflare-eth.com'],
  [polygon.id]: ['https://polygon.llamarpc.com'],
  [avalanche.id]: ['https://avalanche.drpc.org'],
  [bsc.id]: ['https://binance.llamarpc.com'],
  [base.id]: ['https://base-mainnet.public.blastapi.io'],
  [arbitrum.id]: ['https://arbitrum.llamarpc.com'],
  [metis.id]: ['https://metis-mainnet.public.blastapi.io'],
  [optimism.id]: ['https://optimism.llamarpc.com'],
  // testnets
  [goerli.id]: [
    'https://ethereum-goerli.publicnode.com',
    'https://goerli.blockpi.network/v1/rpc/public',
    'https://eth-goerli.public.blastapi.io',
  ],
  [sepolia.id]: ['https://ethereum-sepolia.blockpi.network/v1/rpc/public'],
  [polygonMumbai.id]: ['https://rpc.ankr.com/polygon_mumbai'],
  [avalancheFuji.id]: ['https://api.avax-test.network/ext/bc/C/rpc'],
  [bscTestnet.id]: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
};

function setChain(chain: Chain) {
  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      default: {
        ...chain.rpcUrls.default,
        http: [initialRpcUrls[chain.id][0]],
      },
    },
  };
}

export const CHAINS: Record<number, Chain> = {
  [mainnet.id]: setChain(mainnet),
  [polygon.id]: setChain(polygon),
  [avalanche.id]: setChain(avalanche),
  [bsc.id]: setChain(bsc),
  [base.id]: setChain(base),
  [arbitrum.id]: setChain(arbitrum),
  [metis.id]: setChain(metis),
  [optimism.id]: setChain(optimism),
  // testnets
  [goerli.id]: setChain(goerli),
  [sepolia.id]: setChain(sepolia),
  [polygonMumbai.id]: setChain(polygonMumbai),
  [avalancheFuji.id]: setChain(avalancheFuji),
  [bscTestnet.id]: setChain(bscTestnet),
};
