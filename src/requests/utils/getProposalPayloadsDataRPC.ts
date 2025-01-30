import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';

import { ProposalInitialStruct } from '../../types';
import { getPayloadsDataRPC } from './getPayloadsDataRPC';

export async function getProposalPayloadsDataRPC({
  proposalsData,
  clients,
}: {
  proposalsData: ProposalInitialStruct[];
  clients: ClientsRecord;
}) {
  const payloadsChainsWithIds: Record<number, number[]> = {};
  const initialPayloads = proposalsData
    .map((proposal) => {
      return proposal.payloads;
    })
    .flat();
  const payloadsChains = initialPayloads
    .map((payload) => payload.chain)
    .filter((value, index, self) => self.indexOf(value) === index);
  payloadsChains.forEach((chainId) => {
    payloadsChainsWithIds[Number(chainId)] = initialPayloads
      .filter((payload) => Number(payload.chain) === Number(chainId))
      .map((payload) => payload.payloadId)
      .filter((value, index, self) => self.indexOf(value) === index);
  });
  return (
    await Promise.all(
      Object.entries(payloadsChainsWithIds).map(([chainId, payloadsIds]) =>
        getPayloadsDataRPC({
          chainId: Number(chainId),
          payloadsIds,
          clients,
        }),
      ),
    )
  ).flat();
}
