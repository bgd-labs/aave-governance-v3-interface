import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';

export function getChainName(chainId: number) {
  return chainInfoHelper.getChainParameters(chainId || appConfig.govCoreChainId)
    .chainName;
}
