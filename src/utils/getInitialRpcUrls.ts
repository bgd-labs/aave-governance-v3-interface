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

type RPCUrls = {
  mainnetRPC?: string;
  polygonRPC?: string;
  avalancheRPC?: string;
  bscRPC?: string;
  baseRPC?: string;
  arbitrumRPC?: string;
  metisRPC?: string;
  optimismRPC?: string;
  gnosisRPC?: string;
  scrollRPC?: string;
  zkSyncRPC?: string;
};

export function getInitialRpcUrls({
  mainnetRPC,
  polygonRPC,
  avalancheRPC,
  bscRPC,
  baseRPC,
  arbitrumRPC,
  metisRPC,
  optimismRPC,
  gnosisRPC,
  scrollRPC,
  zkSyncRPC,
}: RPCUrls) {
  return {
    [mainnet.id]: [
      mainnetRPC || 'https://rpc.ankr.com/eth',
      'https://rpc.ankr.com/eth',
      'https://eth.nodeconnect.org',
    ],
    [polygon.id]: [
      polygonRPC || 'https://polygon.blockpi.network/v1/rpc/public',
      'https://polygon.blockpi.network/v1/rpc/public',
      'https://polygon.llamarpc.com',
      'https://polygon-bor.publicnode.com',
      'https://endpoints.omniatech.io/v1/matic/mainnet/public',
    ],
    [avalanche.id]: [
      avalancheRPC || 'https://api.avax.network/ext/bc/C/rpc',
      'https://api.avax.network/ext/bc/C/rpc',
      'https://avalanche.drpc.org',
      'https://avax.meowrpc.com',
      'https://avalanche.blockpi.network/v1/rpc/public',
    ],
    [bsc.id]: [
      bscRPC || 'https://bsc.meowrpc.com',
      'https://binance.llamarpc.com',
      'https://bsc.meowrpc.com',
    ],
    [base.id]: [
      baseRPC || 'https://base.blockpi.network/v1/rpc/public',
      'https://base.blockpi.network/v1/rpc/public',
      'https://base.llamarpc.com',
      'https://base-mainnet.public.blastapi.io',
      'https://base.meowrpc.com',
    ],
    [arbitrum.id]: [
      arbitrumRPC || 'https://endpoints.omniatech.io/v1/arbitrum/one/public',
      'https://arbitrum.llamarpc.com',
      'https://arb-mainnet-public.unifra.io',
      'https://endpoints.omniatech.io/v1/arbitrum/one/public',
    ],
    [metis.id]: [
      metisRPC || 'https://metis-mainnet.public.blastapi.io',
      'https://metis.api.onfinality.io/public',
    ],
    [optimism.id]: [
      optimismRPC || 'https://optimism.blockpi.network/v1/rpc/public',
      'https://optimism.blockpi.network/v1/rpc/public',
      'https://optimism.llamarpc.com',
      'https://optimism.publicnode.com',
    ],
    [gnosis.id]: [
      gnosisRPC || 'https://gnosis.blockpi.network/v1/rpc/public',
      'https://gnosis.blockpi.network/v1/rpc/public',
      'https://gnosis-mainnet.public.blastapi.io',
    ],
    [scroll.id]: [
      scrollRPC || 'https://scroll.blockpi.network/v1/rpc/public',
      'https://scroll.blockpi.network/v1/rpc/public',
      'https://scroll-mainnet.public.blastapi.io',
    ],
    [zkSync.id]: [
      zkSyncRPC || 'https://zksync.meowrpc.com',
      'https://mainnet.era.zksync.io',
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
  } as Record<number, string[]>;
}
