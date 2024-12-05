import { getAssetName } from '@bgd-labs/react-web3-icons/dist/utils';

import { appConfig } from '../configs/appConfig';

export function getAssetSymbolByAddress(address: string) {
  switch (address) {
    case appConfig.additional.aaveAddress:
      return 'AAVE';
    case appConfig.additional.aAaveAddress:
      return 'aAAVE';
    case appConfig.additional.stkAAVEAddress:
      return 'stkAAVE';
  }
}

export function getAssetNameByAddress(address: string) {
  switch (address) {
    case appConfig.additional.aaveAddress:
      return getAssetName({
        symbol: getAssetSymbolByAddress(address) ?? 'AAVE',
      });
    case appConfig.additional.aAaveAddress:
      return getAssetName({
        symbol: getAssetSymbolByAddress(address) ?? 'AAVE',
      });
    case appConfig.additional.stkAAVEAddress:
      return getAssetName({
        symbol: getAssetSymbolByAddress(address) ?? 'AAVE',
      });
  }
}
