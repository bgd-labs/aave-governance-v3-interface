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
function setChain(chain: Chain, url: string) {
  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      default: {
        ...chain.rpcUrls.default,
        http: [url],
      },
    },
  };
}

export const CHAINS: {
  [chainId: number]: Chain;
} = {
  [goerli.id]: {
    ...goerli,
    rpcUrls: {
      ...goerli.rpcUrls,
      default: {
        ...goerli.rpcUrls.default,
        http: ['https://ethereum-goerli.publicnode.com'],
      },
    },
  },
};

// export const CHAINS: Record<number, Chain> = {
//   [mainnet.id]: setChain(mainnet, 'https://cloudflare-eth.com'),
//   [polygon.id]: setChain(polygon, 'https://polygon.llamarpc.com'),
//   [avalanche.id]: setChain(avalanche, 'https://avalanche.drpc.org'),
//   [bsc.id]: setChain(bsc, 'https://binance.llamarpc.com'),
//   [base.id]: setChain(base, 'https://base-mainnet.public.blastapi.io'),
//   [arbitrum.id]: setChain(arbitrum, 'https://arbitrum.llamarpc.com'),
//   [metis.id]: setChain(metis, 'https://metis-mainnet.public.blastapi.io'),
//   [optimism.id]: setChain(optimism, 'https://optimism.llamarpc.com'),
//   // testnets
//   [goerli.id]: setChain(goerli, 'https://ethereum-goerli.publicnode.com'),
//   [sepolia.id]: setChain(
//     sepolia,
//     'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
//   ),
//   [polygonMumbai.id]: setChain(
//     polygonMumbai,
//     'https://rpc.ankr.com/polygon_mumbai',
//   ),
//   [avalancheFuji.id]: setChain(
//     avalancheFuji,
//     'https://api.avax-test.network/ext/bc/C/rpc',
//   ),
//   [bscTestnet.id]: setChain(
//     bscTestnet,
//     'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
//   ),
// };
