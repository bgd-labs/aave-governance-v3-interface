import { IAaveTokenV3_ABI } from '@bgd-labs/aave-governance-ui-helpers/dist/abis/IAaveTokenV3';
import { Address, Client, Hex } from 'viem';
import { getBlock, multicall } from 'viem/actions';

import { GovernancePowerType } from '../../types';

export type GetVotingPowerWithDelegationByBlockHash = {
  client: Client;
  blockHash: Hex;
  address: Address;
  assets: Address[];
};

export async function getVotingPowerWithDelegationByBlockHash({
  client,
  blockHash,
  address,
  assets,
}: GetVotingPowerWithDelegationByBlockHash) {
  const blockNumber = await getBlock(client, {
    blockHash,
  });

  const wagmiContracts = assets.map((asset) => {
    return {
      address: asset,
      abi: IAaveTokenV3_ABI,
    } as const;
  });

  const data = await multicall(client, {
    contracts: [
      ...wagmiContracts.map((contract) => {
        return {
          ...contract,
          functionName: 'balanceOf',
          args: [address],
        };
      }),
      ...wagmiContracts.map((contract) => {
        return {
          ...contract,
          functionName: 'getPowerCurrent',
          args: [address, GovernancePowerType.VOTING],
        };
      }),
    ],
    blockNumber: blockNumber.number,
  });

  return assets.map((asset, index) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const userBalance = data[index][0].result;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const votingPower = data[index][1].result;
    return {
      blockHash,
      asset,
      votingPower: votingPower as bigint,
      userBalance: userBalance as bigint,
      isWithDelegatedPower: userBalance !== votingPower,
    };
  });
}
