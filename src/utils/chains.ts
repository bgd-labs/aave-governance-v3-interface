import { Draft } from 'immer';
import { Chain, createClient, fallback, http } from 'viem';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  bscTestnet,
  celo,
  gnosis,
  linea,
  mainnet,
  metis,
  optimism,
  polygon,
  polygonMumbai,
  scroll,
  sepolia,
  soneium,
  sonic,
  zksync,
} from 'viem/chains';

// chains RPC urls
export const initialRpcUrls: Record<number, string[]> = {
  [mainnet.id]: [
    process.env.NEXT_PUBLIC_RPC_MAINNET || 'https://rpc.ankr.com/eth',
    'https://rpc.ankr.com/eth',
    'https://eth.nodeconnect.org',
  ],
  [polygon.id]: [
    process.env.NEXT_PUBLIC_RPC_POLYGON ||
      'https://polygon.blockpi.network/v1/rpc/public',
    'https://polygon.blockpi.network/v1/rpc/public',
    'https://polygon.llamarpc.com',
    'https://polygon-bor.publicnode.com',
    'https://endpoints.omniatech.io/v1/matic/mainnet/public',
  ],
  [avalanche.id]: [
    process.env.NEXT_PUBLIC_RPC_AVALANCHE ||
      'https://api.avax.network/ext/bc/C/rpc',
    'https://api.avax.network/ext/bc/C/rpc',
    'https://avalanche.drpc.org',
    'https://avax.meowrpc.com',
    'https://avalanche.blockpi.network/v1/rpc/public',
  ],
  [bsc.id]: [
    process.env.NEXT_PUBLIC_RPC_BNB || 'https://bsc.meowrpc.com',
    'https://binance.llamarpc.com',
    'https://bsc.meowrpc.com',
  ],
  [base.id]: [
    process.env.NEXT_PUBLIC_RPC_BASE ||
      'https://base.blockpi.network/v1/rpc/public',
    'https://base.blockpi.network/v1/rpc/public',
    'https://base.llamarpc.com',
    'https://base-mainnet.public.blastapi.io',
    'https://base.meowrpc.com',
  ],
  [arbitrum.id]: [
    process.env.NEXT_PUBLIC_RPC_ARBITRUM ||
      'https://endpoints.omniatech.io/v1/arbitrum/one/public',
    'https://arbitrum.llamarpc.com',
    'https://arb-mainnet-public.unifra.io',
    'https://endpoints.omniatech.io/v1/arbitrum/one/public',
  ],
  [metis.id]: [
    process.env.NEXT_PUBLIC_RPC_METIS ||
      'https://metis-mainnet.public.blastapi.io',
    'https://metis.api.onfinality.io/public',
  ],
  [optimism.id]: [
    process.env.NEXT_PUBLIC_RPC_OPTIMISM ||
      'https://optimism.blockpi.network/v1/rpc/public',
    'https://optimism.blockpi.network/v1/rpc/public',
    'https://optimism.llamarpc.com',
    'https://optimism.publicnode.com',
  ],
  [gnosis.id]: [
    process.env.NEXT_PUBLIC_RPC_GNOSIS ||
      'https://gnosis.blockpi.network/v1/rpc/public',
    'https://gnosis.blockpi.network/v1/rpc/public',
    'https://gnosis-mainnet.public.blastapi.io',
  ],
  [scroll.id]: [
    process.env.NEXT_PUBLIC_RPC_SCROLL ||
      'https://scroll.blockpi.network/v1/rpc/public',
    'https://scroll.blockpi.network/v1/rpc/public',
    'https://scroll-mainnet.public.blastapi.io',
  ],
  [zksync.id]: [
    process.env.NEXT_PUBLIC_RPC_ZKEVM || 'https://zksync.meowrpc.com',
    'https://mainnet.era.zksync.io',
  ],
  [linea.id]: [
    process.env.NEXT_PUBLIC_RPC_LINEA || 'https://linea.drpc.org',
    'https://linea-rpc.publicnode.com',
  ],
  [sonic.id]: [
    process.env.NEXT_PUBLIC_RPC_SONIC || 'https://sonic.drpc.org',
    'https://sonic-rpc.publicnode.com',
  ],
  [celo.id]: [
    process.env.NEXT_PUBLIC_RPC_CELO || 'https://rpc.ankr.com/celo',
    'https://forno.celo.org',
  ],
  [soneium.id]: [
    process.env.NEXT_PUBLIC_RPC_SONEIUM || 'https://rpc.soneium.io',
    'https://rpc.soneium.io',
    'https://soneium.drpc.org',
  ],
  // testnets
  [sepolia.id]: [
    'https://eth-sepolia.public.blastapi.io',
    'https://endpoints.omniatech.io/v1/eth/sepolia/public',
    'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
    'https://ethereum-sepolia.publicnode.com',
  ],
  [polygonMumbai.id]: ['https://rpc.ankr.com/polygon_mumbai'],
  [avalancheFuji.id]: [
    'https://avalanche-fuji.blockpi.network/v1/rpc/public',
    'https://api.avax-test.network/ext/bc/C/rpc',
    'https://avalanche-fuji-c-chain.publicnode.com',
    'https://rpc.ankr.com/avalanche_fuji',
  ],
  [bscTestnet.id]: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
};

export function setChain(chain: Chain, url?: string) {
  const explorers: Record<number, { name: string; url: string }> = {
    [gnosis.id]: {
      name: 'Gnosis chain explorer',
      url: 'https://gnosisscan.io',
    },
    [avalanche.id]: { name: 'Snowscan', url: 'https://snowscan.xyz' },
    [avalancheFuji.id]: {
      name: 'Snowscan Fuji',
      url: 'https://testnet.snowscan.xyz',
    },
  };

  const defaultExplorer = explorers[chain.id] || chain.blockExplorers?.default;

  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      default: {
        ...chain.rpcUrls.default,
        http: [url || initialRpcUrls[chain.id][0], ...initialRpcUrls[chain.id]],
      },
    },
    blockExplorers: {
      ...chain.blockExplorers,
      default: defaultExplorer,
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
  [gnosis.id]: setChain(gnosis),
  [scroll.id]: setChain(scroll),
  [zksync.id]: setChain(zksync),
  [linea.id]: setChain(linea),
  [sonic.id]: setChain(sonic),
  [celo.id]: setChain(celo),
  [soneium.id]: setChain(soneium),
  // testnets
  [sepolia.id]: setChain(sepolia),
  [polygonMumbai.id]: setChain(polygonMumbai),
  [avalancheFuji.id]: setChain(avalancheFuji),
  [bscTestnet.id]: setChain(bscTestnet),
};

export const fallBackConfig = {
  rank: false,
  retryDelay: 30,
  retryCount: 3,
};

export const createViemClient = (
  chain: Chain,
  rpcUrl: string,
  withoutFallback?: boolean,
) =>
  createClient({
    batch: {
      multicall: true,
    },
    chain: setChain(chain, rpcUrl) as Draft<Chain>,
    transport: withoutFallback
      ? http(rpcUrl)
      : fallback(
          [http(rpcUrl), ...initialRpcUrls[chain.id].map((url) => http(url))],
          fallBackConfig,
        ),
  });
