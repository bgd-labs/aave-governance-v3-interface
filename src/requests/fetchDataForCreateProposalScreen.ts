import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';

import { getPayloadsCountsRPC } from './utils/getPayloadsCountsRPC';
import { getProposalsDataRPC } from './utils/getProposalsDataRPC';

export type FetchDataForCreateProposalScreen = {
  proposalsCount: bigint;
  clients: ClientsRecord;
};

export async function fetchDataForCreateProposalScreen({
  input,
}: {
  input: FetchDataForCreateProposalScreen;
}) {
  const { clients, proposalsCount } = input;
  const proposalsData = await getProposalsDataRPC({
    clients,
    proposalsCount: Number(proposalsCount),
  });
  const { payloadsAvailableIds, payloadsCounts } = await getPayloadsCountsRPC({
    proposalsCount,
    clients,
    proposalsData,
  });
  return {
    payloadsCounts,
    payloadsAvailableIds,
    proposalsData,
  };
}
