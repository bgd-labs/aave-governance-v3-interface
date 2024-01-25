import { initChainInformationConfig } from '@bgd-labs/frontend-web3-utils';

import { CHAINS } from './chains';

// ipfs gateway to get proposals metadata
export const ipfsGateway = 'https://cloudflare-ipfs.com/ipfs';

export const chainInfoHelper = initChainInformationConfig(CHAINS);
