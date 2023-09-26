import { AddEthereumChainParameter } from '@web3-react/types';

import {
  ChainIdByName,
  ipfsGateway as baseIpfsGateway,
} from '../../lib/helpers/src';
import {
  AVAX,
  ChainInformation,
  ETH,
  initChainInformationConfig,
  initialChains,
  MATIC,
} from '../../lib/web3/src';

// ipfs gateway to get proposals metadata
export const ipfsGateway = baseIpfsGateway;

// chains information (RPC (urls), nativeCurrency, name, blockExplorerUrls)
export const BNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Binance Coin',
  symbol: 'BNB',
  decimals: 18,
};

export const MTC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Metis Token',
  symbol: 'Metis',
  decimals: 18,
};

const CHAINS: {
  [chainId: number]: ChainInformation;
} = {
  [ChainIdByName.EthereumMainnet]: {
    urls: [`https://cloudflare-eth.com`],
    nativeCurrency: ETH,
    name: 'Ethereum Mainnet',
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  [ChainIdByName.Polygon]: {
    urls: [`https://polygon.llamarpc.com`],
    nativeCurrency: MATIC,
    name: 'Polygon',
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  [ChainIdByName.Avalanche]: {
    urls: [`https://avalanche.drpc.org`],
    nativeCurrency: AVAX,
    name: 'Avalanche',
    blockExplorerUrls: ['https://snowtrace.io/'],
  },
  [ChainIdByName.Binance]: {
    urls: [`https://binance.llamarpc.com`],
    nativeCurrency: BNB,
    name: 'BNB Smart Chain',
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  [ChainIdByName.Base]: {
    urls: [`https://base-mainnet.public.blastapi.io`],
    nativeCurrency: ETH,
    name: 'Base',
    blockExplorerUrls: ['https://basescan.org/'],
  },
  [ChainIdByName.Arbitrum]: {
    urls: [`https://arbitrum.llamarpc.com`],
    nativeCurrency: ETH,
    name: 'Arbitrum',
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
  [ChainIdByName.Metis]: {
    urls: [`https://metis-mainnet.public.blastapi.io`],
    nativeCurrency: MTC,
    name: 'Metis',
    blockExplorerUrls: ['https://explorer.metis.io/'],
  },
  [ChainIdByName.Optimism]: {
    urls: [`https://optimism.llamarpc.com`],
    nativeCurrency: ETH,
    name: 'OP Mainnet',
    blockExplorerUrls: ['https://optimistic.etherscan.io/'],
  },
  // testnets
  [ChainIdByName.Goerli]: {
    urls: [`https://goerli.blockpi.network/v1/rpc/public`],
    nativeCurrency: ETH,
    name: 'Goerli Testnet',
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
  },
  [ChainIdByName.Sepolia]: {
    urls: [`https://ethereum-sepolia.blockpi.network/v1/rpc/public`],
    nativeCurrency: ETH,
    name: 'Sepolia Testnet',
    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
  },
  [ChainIdByName.Mumbai]: {
    urls: [`https://rpc.ankr.com/polygon_mumbai`],
    nativeCurrency: MATIC,
    name: 'Mumbai Testnet',
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  },
  [ChainIdByName.AvalancheFuji]: {
    urls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    nativeCurrency: AVAX,
    name: 'Avalanche fuji',
    blockExplorerUrls: ['https://testnet.snowtrace.io/'],
  },
  [ChainIdByName.BnbTest]: {
    urls: [`https://data-seed-prebsc-1-s1.bnbchain.org:8545`],
    nativeCurrency: BNB,
    name: 'BSC Testnet',
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
  },
};

export const internalChains = Object.assign(initialChains, CHAINS);

export const chainInfoHelper = initChainInformationConfig(CHAINS);
