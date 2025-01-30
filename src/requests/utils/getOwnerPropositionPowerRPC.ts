import { Address, Client, formatUnits, getContract } from 'viem';

import { DECIMALS } from '../../configs/configs';
import { GovernancePowerType } from '../../types';
import { IAaveTokenV3_ABI } from '../abis/IAaveTokenV3';

export type GetCreatorPropositionPower = {
  underlyingAssets: string[];
  creatorAddress: string;
  govCoreClient: Client;
};

export async function getCreatorPropositionPowerRPC({
  underlyingAssets,
  creatorAddress,
  govCoreClient,
}: GetCreatorPropositionPower) {
  const contracts = underlyingAssets.map((asset) =>
    getContract({
      address: asset as Address,
      abi: IAaveTokenV3_ABI,
      client: govCoreClient,
    }),
  );

  const data = await Promise.all(
    contracts.map(async (contract) => {
      const power = await contract.read.getPowerCurrent([
        creatorAddress as Address,
        GovernancePowerType.PROPOSITION,
      ]);

      return {
        underlyingAsset: contract.address,
        delegationPropositionPower: power,
      };
    }),
  );

  const creatorBalance = data
    .map((balance) => balance.delegationPropositionPower)
    .reduce((sum, value) => sum + value, 0n);

  return +formatUnits(creatorBalance, DECIMALS);
}
