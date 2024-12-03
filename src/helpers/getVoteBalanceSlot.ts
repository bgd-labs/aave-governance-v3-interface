import { appConfig } from '../configs/appConfig';

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

export function getVoteBalanceSlot(
  assetAddress: string,
  isWithDelegatedPower?: boolean,
) {
  return assetAddress.toLowerCase() === appConfig.additional.aAaveAddress &&
    isWithDelegatedPower
    ? (SLOTS[assetAddress.toLowerCase()].delegation ?? 64)
    : (SLOTS[assetAddress.toLowerCase()].balance ?? 0);
}
