import { IVotingPortal_ABI } from '@bgd-labs/aave-address-book/abis';
import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { readContract } from 'viem/actions';

import { appConfig } from '../../configs/appConfig';
import { PayloadInitialStruct, ProposalInitialStruct } from '../../types';
import { getVotingDataRPC } from './getVotingDataRPC';

export async function getVotingProposalsDataRPC({
  activeIds,
  proposalsWithPayloads,
  clients,
}: {
  activeIds: number[];
  proposalsWithPayloads: {
    proposal: ProposalInitialStruct;
    payloads: PayloadInitialStruct[];
  }[];
  clients: ClientsRecord;
}) {
  const proposalsForGetVotingData = await Promise.all(
    activeIds.map(async (id) => {
      const proposal = proposalsWithPayloads.filter(
        (item) => item.proposal.id === id,
      )[0].proposal;
      const votingChainId = await readContract(
        clients[appConfig.govCoreChainId],
        {
          abi: IVotingPortal_ABI,
          address: proposal.votingPortal,
          functionName: 'VOTING_MACHINE_CHAIN_ID',
          args: [],
        },
      );
      return {
        id: BigInt(proposal.id),
        votingChainId: Number(votingChainId),
        snapshotBlockHash: proposal.snapshotBlockHash,
      };
    }),
  );

  return proposalsForGetVotingData.length > 0
    ? await getVotingDataRPC({
        initialProposals: proposalsForGetVotingData,
        clients,
      })
    : [];
}
