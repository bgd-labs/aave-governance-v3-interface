import { getAssetName } from '@bgd-labs/react-web3-icons/dist/utils';

import { appConfig } from '../configs/appConfig';

export function getAssetSymbolByAddress(address: string) {
  switch (address.toLowerCase()) {
    case appConfig.additional.aaveAddress.toLowerCase():
      return 'AAVE';
    case appConfig.additional.aAaveAddress.toLowerCase():
      return 'aAAVE';
    case appConfig.additional.stkAAVEAddress.toLowerCase():
      return 'stkAAVE';
    // TIP: Symbol for new voting asset is added here
    // example:
    //     case appConfig.additional.newVotingAsset.toLowerCase():
    //       return 'newVotingAssetSymbol';
  }
}

export function getAssetNameByAddress(address: string) {
  switch (address.toLowerCase()) {
    case appConfig.additional.aaveAddress.toLowerCase():
      return getAssetName({
        symbol: getAssetSymbolByAddress(address) ?? 'AAVE',
      });
    case appConfig.additional.aAaveAddress.toLowerCase():
      return `a${getAssetName({
        symbol: 'AAVE',
      })}`;
    case appConfig.additional.stkAAVEAddress.toLowerCase():
      return getAssetName({
        symbol: getAssetSymbolByAddress(address) ?? 'AAVE',
      });
    // TIP: Name for new voting asset is added here
    // example:
    //    case appConfig.additional.newVotingAsset.toLowerCase():
    //       return getAssetName({
    //         symbol: getAssetSymbolByAddress(address) ?? 'AAVE',
    //       });
  }
}
