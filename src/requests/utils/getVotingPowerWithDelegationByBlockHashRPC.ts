import { Address, Client, Hex } from 'viem';
import { getBlock, multicall } from 'viem/actions';

import { GovernancePowerType } from '../../types';
import { IAaveTokenV3_ABI } from '../abis/IAaveTokenV3';

export type GetVotingPowerWithDelegationByBlockHashRPC = {
  client: Client;
  blockHash: Hex;
  address: Address;
  assets: Address[];
};

export async function getVotingPowerWithDelegationByBlockHashRPC({
  client,
  blockHash,
  address,
  assets,
}: GetVotingPowerWithDelegationByBlockHashRPC) {
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
    const userBalance = data[index].result;
    const votingPower = data[assets.length + index].result;
    return {
      blockHash,
      asset,
      votingPower: votingPower as bigint,
      userBalance: userBalance as bigint,
      isWithDelegatedPower: userBalance !== votingPower,
    };
  });
}
