import {
  IGovernanceCore_ABI,
  IGovernanceDataHelper_ABI,
} from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { PAGE_SIZE } from '../../configs/configs';
import { GetProposalsData, ProposalInitialStruct } from '../../types';

export async function getProposalsDataRPC({
  proposalsCount,
  proposalsIds,
  clients,
}: GetProposalsData & { clients: ClientsRecord }) {
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

  if (fr === 0) {
    const data = await readContract(clients[appConfig.govCoreChainId], {
      abi: IGovernanceCore_ABI,
      address: appConfig.govCoreConfig.contractAddress,
      functionName: 'getProposal',
      args: [0n],
    });
    return [
      {
        id: 0,
        ...data,
      },
    ] as ProposalInitialStruct[];
  } else {
    const data = await readContract(clients[appConfig.govCoreChainId], {
      abi: IGovernanceDataHelper_ABI,
      address: appConfig.govCoreConfig.dataHelperContractAddress,
      functionName: 'getProposalsData',
      args: [
        appConfig.govCoreConfig.contractAddress,
        BigInt(fr),
        BigInt(to || 0),
        BigInt(proposalsCount || PAGE_SIZE),
      ],
    });

    return data.map((proposal) => {
      return {
        id: Number(proposal.id),
        ...proposal.proposalData,
      } as ProposalInitialStruct;
    });
  }
}
