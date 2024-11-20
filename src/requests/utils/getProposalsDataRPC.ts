import { IGovernanceDataHelper_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { PAGE_SIZE } from '../../configs/configs';
import { ProposalInitialStruct } from '../../types';
import { GetProposalsData } from './getProposalsData';

export async function getProposalsDataRPC({
  proposalsCount,
  proposalsIds,
  clients,
}: GetProposalsData & { clients: Record<number, Client> }) {
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

  return (
    await readContract(clients[appConfig.govCoreChainId], {
      abi: IGovernanceDataHelper_ABI,
      address: appConfig.govCoreConfig.dataHelperContractAddress,
      functionName: 'getProposalsData',
      args: [
        appConfig.govCoreConfig.contractAddress,
        BigInt(fr),
        BigInt(to || 0),
        BigInt(proposalsCount || PAGE_SIZE),
      ],
    })
  ).map((proposal) => {
    return {
      id: Number(proposal.id),
      ...proposal.proposalData,
    } as ProposalInitialStruct;
  });
}
