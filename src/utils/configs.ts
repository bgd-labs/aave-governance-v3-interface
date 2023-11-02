import { ipfsGateway as baseIpfsGateway } from '@bgd-labs/aave-governance-ui-helpers';
import { initChainInformationConfig } from '@bgd-labs/frontend-web3-utils';

import { CHAINS } from './chains';

// ipfs gateway to get proposals metadata
export const ipfsGateway = baseIpfsGateway;

export const chainInfoHelper = initChainInformationConfig(CHAINS);
