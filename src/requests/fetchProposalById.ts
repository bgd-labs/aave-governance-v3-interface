import { Client } from 'viem';

import { appConfig } from '../configs/appConfig';
import { getProposalsDataRPC } from './utils/getProposalsDataRPC';

export type FetchProposalByIdParams = {
  proposalId: number;
  govCoreClient: Client;
};

export async function fetchProposalById({
  input,
}: {
  input: FetchProposalByIdParams;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposal data by id from API, using RPC fallback',
      e,
    );
    return await getProposalsDataRPC({
      proposalsIds: [input.proposalId],
      clients: { [appConfig.govCoreChainId]: input.govCoreClient },
    });
  }
}
