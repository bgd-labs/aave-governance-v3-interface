import { initChainInformationConfig } from '@bgd-labs/frontend-web3-utils';

import { CHAINS } from './chains';

// ipfs gateway to get proposals metadata
export const ipfsGateway = 'https://cloudflare-ipfs.com/ipfs';
export const fallbackGateways = [
  'https://ipfs.io',
  'https://ipfs.eth.aragon.network',
  'https://dweb.link',
  'https://ipfs.runfission.com',
];

export const chainInfoHelper = initChainInformationConfig(CHAINS);
