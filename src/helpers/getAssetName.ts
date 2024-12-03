import { getAssetName } from '@bgd-labs/react-web3-icons/dist/utils';

import { appConfig } from '../configs/appConfig';

export function getAssetNameByAddress(address: string) {
  switch (address) {
    case appConfig.additional.aaveAddress:
      return getAssetName({ symbol: 'AAVE' });
    case appConfig.additional.aAaveAddress:
      return getAssetName({ symbol: 'aAAVE' });
    case appConfig.additional.stkAAVEAddress:
      return getAssetName({ symbol: 'stkAAVE' });
  }
}
