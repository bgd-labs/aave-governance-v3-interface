import { appConfig } from '../../configs/appConfig';
import { cachingLayer } from './cachingLayer';

export type GetProposalsData = {
  proposalsCount?: number;
  proposalsIds?: number[];
};

export async function getProposalsData({
  proposalsCount,
  proposalsIds,
}: GetProposalsData) {
  const ids = proposalsCount
    ? [...Array(Number(proposalsCount)).keys()]
    : (proposalsIds ?? []);
  return await Promise.all(
    ids.map(async (id) => {
      const data = await cachingLayer.getProposal({
        chainId: appConfig.govCoreChainId,
        governance: appConfig.govCoreConfig.contractAddress,
        proposalId: BigInt(id),
      });
      return {
        ...data,
        proposal: {
          ...data.proposal,
          id,
        },
      };
    }),
  );
}
