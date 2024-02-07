import { Asset } from '@bgd-labs/governance-v3-js-utils/dist/utils';

import { appConfig } from './appConfig';

export function getAssetName(assetAddress: string) {
  switch (assetAddress.toLowerCase()) {
    case appConfig.additional.aaveAddress.toLowerCase():
      return Asset.AAVE;
    case appConfig.additional.stkAAVEAddress.toLowerCase():
      return Asset.STKAAVE;
    case appConfig.additional.aAaveAddress.toLowerCase():
      return Asset.AAAVE;
    case appConfig.govCoreConfig.contractAddress.toLowerCase():
      return Asset.GOVCORE;

    default:
      console.error('Token address incorrect');
      return '';
  }
}
