import {
  Asset,
  AssetsBalanceSlots,
  baseSlots,
} from '@bgd-labs/aave-governance-ui-helpers';

import { appConfig } from '../../utils/appConfig';

export const assetsBalanceSlots: AssetsBalanceSlots = {
  [appConfig.additional.stkAAVEAddress.toLowerCase()]: {
    ...baseSlots[Asset.STKAAVE],
  },
  [appConfig.additional.aAaveAddress.toLowerCase()]: {
    ...baseSlots[Asset.AAAVE],
  },
  [appConfig.additional.aaveAddress.toLowerCase()]: {
    ...baseSlots[Asset.AAVE],
  },
  [appConfig.govCoreConfig.contractAddress.toLowerCase()]: {
    ...baseSlots[Asset.GOVCORE],
  },
};
