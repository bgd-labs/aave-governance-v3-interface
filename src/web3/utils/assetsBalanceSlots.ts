import { Balance } from '@bgd-labs/aave-governance-ui-helpers';
import {
  Asset,
  AssetsBalanceSlots,
  baseSlots,
  getVoteBalanceSlot,
} from '@bgd-labs/governance-v3-js-utils/dist/utils';
import { Address } from 'viem';

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

export function formatBalances(balances: Balance[], aAaveAddress: Address) {
  let formattedBalances = balances;
  const aAAVEBalance = balances.find(
    (balance) => balance.underlyingAsset === aAaveAddress,
  );

  const isAAAVEBalanceWithDelegation =
    aAAVEBalance?.isWithDelegatedPower || false;

  if (aAAVEBalance) {
    if (isAAAVEBalanceWithDelegation) {
      const isUserAAAVEBalance = aAAVEBalance.userBalance !== '0';
      if (isUserAAAVEBalance) {
        formattedBalances = [
          ...balances,
          {
            ...aAAVEBalance,
            isWithDelegatedPower: false,
          },
        ];
      }
    }
  }
  return formattedBalances;
}

export function getVotingAssetsWithSlot({
  balances,
  aAaveAddress,
  slots,
}: {
  balances: Balance[];
  aAaveAddress: Address;
  slots: AssetsBalanceSlots;
}) {
  return balances
    .filter((balance) => balance.value !== '0')
    .map((balance) => {
      return {
        underlyingAsset: balance.underlyingAsset,
        slot: getVoteBalanceSlot(
          balance.underlyingAsset,
          balance.isWithDelegatedPower,
          aAaveAddress,
          slots,
        ),
      };
    });
}
