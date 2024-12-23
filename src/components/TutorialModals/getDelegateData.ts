import { appConfig } from '../../configs/appConfig';
import { DelegateItem } from '../../types';

export function getDelegateData() {
  return [
    {
      underlyingAsset: appConfig.additional.aaveAddress,
      symbol: 'AAVE',
      amount: 100,
      votingToAddress: '',
      propositionToAddress: '0x86E284421664840Cb65C5b918Da59c01ED8fA666',
    },
  ] as DelegateItem[];
}
