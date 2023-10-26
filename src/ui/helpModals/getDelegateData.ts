import { DelegateItem } from '../../delegate/types';
import { appConfig } from '../../utils/appConfig';

export function getDelegateData() {
  return [
    {
      underlyingAsset: appConfig.additional.aaveAddress,
      symbol: 'AAVE',
      amount: 100,
      votingToAddress: '0x0',
      propositionToAddress: '0x86E284421664840Cb65C5b918Da59c01ED8fA666',
    },
  ] as DelegateItem[];
}
