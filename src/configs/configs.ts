import { initChainInformationConfig } from '@bgd-labs/frontend-web3-utils';

import { CHAINS } from './chains';

// ipfs gateway to get proposals metadata
export const ipfsGateway = 'https://dweb.link/ipfs';
export const fallbackGateways = [
  'https://ipfs.eth.aragon.network/ipfs',
  'https://ipfs.runfission.com/ipfs',
];

export const chainInfoHelper = initChainInformationConfig(CHAINS);

// proposals list page size
export const PAGE_SIZE = 12;

// for balance formatting
export const DECIMALS = 18;
