import { Address } from 'viem';

import { appConfig } from '../configs/appConfig';
import { VotingDataByUser } from '../types';

export const SLOTS: Record<
  string,
  { balance: number; delegation?: number; exchangeRate?: number }
> = {
  [appConfig.additional.stkAAVEAddress.toLowerCase()]: {
    balance: 0,
    exchangeRate: 81,
  },
  [appConfig.additional.aAaveAddress.toLowerCase()]: {
    balance: 52,
    delegation: 64,
  },
  [appConfig.additional.aaveAddress.toLowerCase()]: { balance: 0 },
  [appConfig.govCoreConfig.contractAddress.toLowerCase()]: { balance: 9 },
} as const;

export function formatBalances(balances: VotingDataByUser[]) {
  let formattedBalances = balances;
  const aAAVEBalance = balances.find(
    (balance) =>
      balance.asset.toLowerCase() ===
      appConfig.additional.aAaveAddress.toLowerCase(),
  );

  const isAAAVEBalanceWithDelegation =
    aAAVEBalance?.isWithDelegatedPower || false;

  if (aAAVEBalance) {
    if (isAAAVEBalanceWithDelegation) {
      const isUserAAAVEBalance = aAAVEBalance.userBalance !== 0n;
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

export function getVoteBalanceSlot(
  assetAddress: string,
  isWithDelegatedPower?: boolean,
) {
  return assetAddress.toLowerCase() === appConfig.additional.aAaveAddress &&
    isWithDelegatedPower
    ? (SLOTS[assetAddress.toLowerCase()].delegation ?? 64)
    : (SLOTS[assetAddress.toLowerCase()].balance ?? 0);
}

export function getVotingAssetsWithSlot({
  balances,
}: {
  balances: VotingDataByUser[];
}) {
  return balances
    .filter((balance) => balance.votingPower !== 0n)
    .map((balance) => {
      return {
        underlyingAsset: balance.asset as Address,
        slot: getVoteBalanceSlot(balance.asset, balance.isWithDelegatedPower),
      };
    });
}
