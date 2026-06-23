import { appConfig } from '../../utils/appConfig';
import { CHAINS } from '../../utils/chains';
import { chainInfoHelper } from '../../utils/configs';

export const unsupportedNetworkName = 'Unsupported network';

export function isSupportedChainId(chainId?: number) {
  return !!CHAINS[chainId || appConfig.govCoreChainId];
}

export function getChainName(chainId: number) {
  if (!isSupportedChainId(chainId)) {
    return unsupportedNetworkName;
  }

  return chainInfoHelper.getChainParameters(chainId || appConfig.govCoreChainId)
    .name;
}
