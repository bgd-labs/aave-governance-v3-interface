import { Address } from 'viem';

import { appConfig } from './appConfig';
import { chainInfoHelper } from './configs';

export function getScanLink({
  chainId = appConfig.govCoreChainId,
  address,
  type = 'address',
}: {
  chainId?: number;
  address: Address | string;
  type?: 'address' | 'tx';
}) {
  return `${chainInfoHelper.getChainParameters(chainId).blockExplorers?.default
    .url}/${type}/${address}`;
}
