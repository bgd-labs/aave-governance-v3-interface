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
  lineaRPC?: string;
  celoRPC?: string;
  // TIP: The new chain rpc name should be here
};

export function getInitialRpcUrls({ ...urls }: RPCUrls) {
  return {
    [mainnet.id]: [
      urls.mainnetRPC || 'https://rpc.ankr.com/eth',
      'https://rpc.ankr.com/eth',
      'https://eth.nodeconnect.org',
    ],
    [polygon.id]: [
      urls.polygonRPC ||
        'https://endpoints.omniatech.io/v1/matic/mainnet/public',
      'https://polygon.llamarpc.com',
      'https://polygon-bor.publicnode.com',
    ],
    [avalanche.id]: [
      urls.avalancheRPC || 'https://api.avax.network/ext/bc/C/rpc',
      'https://api.avax.network/ext/bc/C/rpc',
      'https://avalanche.drpc.org',
      'https://avax.meowrpc.com',
      'https://avalanche.blockpi.network/v1/rpc/public',
    ],
    [bsc.id]: [
      urls.bscRPC || 'https://bsc.meowrpc.com',
      'https://binance.llamarpc.com',
      'https://bsc.meowrpc.com',
    ],
    [base.id]: [
      urls.baseRPC || 'https://base.blockpi.network/v1/rpc/public',
      'https://base.blockpi.network/v1/rpc/public',
      'https://base.llamarpc.com',
      'https://base-mainnet.public.blastapi.io',
      'https://base.meowrpc.com',
    ],
    [arbitrum.id]: [
      urls.arbitrumRPC ||
        'https://endpoints.omniatech.io/v1/arbitrum/one/public',
      'https://arbitrum.llamarpc.com',
      'https://arb-mainnet-public.unifra.io',
      'https://endpoints.omniatech.io/v1/arbitrum/one/public',
    ],
    [metis.id]: [
      urls.metisRPC || 'https://metis-mainnet.public.blastapi.io',
      'https://metis.api.onfinality.io/public',
    ],
    [optimism.id]: [
      urls.optimismRPC || 'https://optimism.blockpi.network/v1/rpc/public',
      'https://optimism.blockpi.network/v1/rpc/public',
      'https://optimism.llamarpc.com',
      'https://optimism.publicnode.com',
    ],
    [gnosis.id]: [
      urls.gnosisRPC || 'https://gnosis.blockpi.network/v1/rpc/public',
      'https://gnosis.blockpi.network/v1/rpc/public',
      'https://gnosis-mainnet.public.blastapi.io',
    ],
    [scroll.id]: [
      urls.scrollRPC || 'https://scroll.blockpi.network/v1/rpc/public',
      'https://scroll.blockpi.network/v1/rpc/public',
      'https://scroll-mainnet.public.blastapi.io',
    ],
    [zkSync.id]: [
      urls.zkSyncRPC || 'https://zksync.meowrpc.com',
      'https://mainnet.era.zksync.io',
    ],
    [linea.id]: [
      urls.lineaRPC || 'https://linea.drpc.org',
      'https://linea-rpc.publicnode.com',
    ],
    [celo.id]: [
      urls.celoRPC || 'https://rpc.ankr.com/celo',
      'https://forno.celo.org',
    ],
    // TIP: The new chain public RPC urls should be here
    // example:
    //     [newRPC.id] (can be getting from `viem`): [
    //       urls.newRPC || 'https://publicRPC.com',
    //       'https://publicRPC.com',
    //     ],
    // testnets
    [sepolia.id]: [
      'https://sepolia.drpc.org',
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
