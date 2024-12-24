import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { FeesDataAPI } from '../server/api/types';
import {
  CreationFee,
  CreationFeeState,
  InitialProposalState,
  ProposalState,
} from '../types';

export type FetchCreationFeesParams = {
  creator: string;
};

export async function fetchCreationFeesByCreator({
  input,
}: {
  input: FetchCreationFeesParams;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const data = (await (
        await fetch(
          `${INITIAL_API_URL}/proposals/creator/${input.creator}/getProposals/`,
        )
      ).json()) as FeesDataAPI[];

      return (data ?? []).map((data, index) => {
        let status = CreationFeeState.LATER;
        if (data.state === InitialProposalState.Cancelled) {
          status = CreationFeeState.NOT_AVAILABLE;
        } else if (
          data.state >= InitialProposalState.Executed &&
          Number(data.cancellationFee) > 0
        ) {
          status = CreationFeeState.AVAILABLE;
        } else if (
          data.state >= InitialProposalState.Executed &&
          Number(data.cancellationFee) <= 0
        ) {
          status = CreationFeeState.RETURNED;
        }

        let proposalStatus = ProposalState.Created;
        if (data.state === InitialProposalState.Active) {
          proposalStatus = ProposalState.Voting;
        } else if (data.state === InitialProposalState.Queued) {
          proposalStatus = ProposalState.Succeed;
        } else if (data.state === InitialProposalState.Executed) {
          proposalStatus = ProposalState.Executed;
        } else if (
          data.state === InitialProposalState.Failed ||
          data.state === InitialProposalState.Expired
        ) {
          proposalStatus = ProposalState.Failed;
        } else if (data.state === InitialProposalState.Cancelled) {
          proposalStatus = ProposalState.Canceled;
        }

        return {
          proposalId: data.proposalId,
          proposalStatus,
          ipfsHash: data.ipfsHash,
          title: data.title ?? `Proposal ${index}`,
          status,
        } as CreationFee;
      });
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error('Error getting creation fees data from API', e);
  }
}
