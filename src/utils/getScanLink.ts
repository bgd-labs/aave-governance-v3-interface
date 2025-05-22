import { appConfig } from './appConfig';
import { CHAINS } from './chains';

export function getScanLink({
  chainId = appConfig.govCoreChainId,
  address,
  type = 'address',
}: {
  chainId?: number;
  address: string;
  type?: 'address' | 'tx';
}) {
  const baseUrl = CHAINS[chainId]?.blockExplorers?.default.url || '';
  const url = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${url}${type}/${address}`;
}
