import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import {
  CreationFee,
  CreationFeeState,
  FeesDataAPI,
  InitialProposalState,
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

        return {
          proposalId: data.proposalId,
          proposalStatus: data.state,
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
