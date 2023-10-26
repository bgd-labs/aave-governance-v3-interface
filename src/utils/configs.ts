import { ipfsGateway as baseIpfsGateway } from '@bgd-labs/aave-governance-ui-helpers';
import {
  initChainInformationConfig,
  initialChains,
} from '@bgd-labs/frontend-web3-utils';

import { CHAINS } from './chains';

// ipfs gateway to get proposals metadata
export const ipfsGateway = baseIpfsGateway;

export const internalChains = Object.assign(initialChains, CHAINS);
export const chainInfoHelper = initChainInformationConfig(CHAINS);
