import { IGovernanceDataHelper_ABI } from '@bgd-labs/aave-address-book';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { PAGE_SIZE } from '../../configs/configs';

export type GetProposalsData = {
  proposalsCount?: number;
  proposalsIds?: number[];
  pageSize?: number;
  clients: Record<number, Client>;
};

export async function getProposalsData({
  proposalsCount,
  proposalsIds,
  pageSize,
  clients,
}: GetProposalsData) {
  const ids = proposalsCount
    ? [...Array(Number(proposalsCount)).keys()]
    : (proposalsIds ?? []);

  const fr = Math.max.apply(
    null,
    ids.map((id) => id),
  );
  const to = Math.min.apply(
    null,
    ids.map((id) => id),
  );

  return await readContract(clients[appConfig.govCoreChainId], {
    abi: IGovernanceDataHelper_ABI,
    address: appConfig.govCoreConfig.dataHelperContractAddress,
    functionName: 'getProposalsData',
    args: [
      appConfig.govCoreConfig.contractAddress,
      BigInt(fr),
      BigInt(to || 0),
      BigInt(pageSize || proposalsCount || PAGE_SIZE),
    ],
  });
}
