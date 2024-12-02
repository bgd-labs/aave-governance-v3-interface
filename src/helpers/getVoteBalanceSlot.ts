import { appConfig } from '../configs/appConfig';

export const SLOTS: Record<
  string,
  { balance: number; delegation?: number; exchangeRate?: number }
> = {
  [appConfig.additional.stkAAVEAddress]: { balance: 0, exchangeRate: 81 },
  [appConfig.additional.aAaveAddress]: {
    balance: 52,
    delegation: 64,
  },
  [appConfig.additional.aaveAddress]: { balance: 0 },
  [appConfig.govCoreConfig.contractAddress]: { balance: 9 },
} as const;

export function getVoteBalanceSlot(
  assetAddress: string,
  isWithDelegatedPower?: boolean,
) {
  return assetAddress.toLowerCase() ===
    appConfig.additional.aAaveAddress.toLowerCase() && isWithDelegatedPower
    ? (SLOTS[assetAddress.toLowerCase()].delegation ?? 64)
    : (SLOTS[assetAddress.toLowerCase()].balance ?? 0);
}
