import { Balance } from '@bgd-labs/aave-governance-ui-helpers';
import { Hex, toHex } from 'viem';

import { appConfig } from '../../utils/appConfig';
import { GovDataService } from '../../web3/services/govDataService';
import {
  getSolidityTwoLevelStorageSlotHash,
  getVoteBalanceSlot,
} from '../../web3/utils/helperToGetProofs';

export function formatBalances(balances: Balance[]) {
  let formattedBalances = balances;
  const aAAVEBalance = balances.find(
    (balance) => balance.underlyingAsset === appConfig.additional.aAaveAddress,
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

export async function getVotingProofs(
  blockHash: Hex,
  balances: Balance[],
  govDataService: GovDataService,
  address: Hex,
) {
  const blockNumber = await govDataService.getCoreBlockNumber(blockHash);

  return await Promise.all(
    balances
      .filter((balance) => balance.value !== '0')
      .map((balance) => {
        const balanceSlotRaw = getVoteBalanceSlot(
          balance.underlyingAsset,
          balance.isWithDelegatedPower,
        );

        return govDataService.getAndFormatProof({
          userAddress: address,
          underlyingAsset: balance.underlyingAsset,
          baseBalanceSlotRaw: balanceSlotRaw,
          blockNumber: blockNumber,
        });
      }),
  );
}

export async function getProofOfRepresentative(
  blockHash: Hex,
  govDataService: GovDataService,
  address: Hex,
  chainId: number,
) {
  const blockNumber = await govDataService.getCoreBlockNumber(blockHash);
  const balanceSlotRaw = getVoteBalanceSlot(
    appConfig.govCoreConfig.contractAddress,
    false,
  );
  const hexSlot = toHex(balanceSlotRaw);
  const slot = getSolidityTwoLevelStorageSlotHash(hexSlot, address, chainId);

  return await govDataService.getProofs({
    underlyingAsset: appConfig.govCoreConfig.contractAddress,
    slot,
    blockNumber,
  });
}

export function getVotingAssetsWithSlot(balances: Balance[]) {
  return balances
    .filter((balance) => balance.value !== '0')
    .map((balance) => {
      return {
        underlyingAsset: balance.underlyingAsset,
        slot: getVoteBalanceSlot(
          balance.underlyingAsset,
          balance.isWithDelegatedPower,
        ),
      };
    });
}
