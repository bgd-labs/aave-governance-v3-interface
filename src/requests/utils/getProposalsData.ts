import { Client } from 'viem';

import { appConfig } from '../../configs/appConfig';
import { cachingLayer } from './cachingLayer';
import { getProposalMetadata } from './getProposalMetadata';
import { getProposalsDataRPC } from './getProposalsDataRPC';

export type GetProposalsData = {
  proposalsCount?: number;
  proposalsIds?: number[];
  clients?: Record<number, Client>;
};

export async function getProposalsData({
  proposalsCount,
  proposalsIds,
  clients,
}: GetProposalsData) {
  const ids = proposalsCount
    ? [...Array(Number(proposalsCount)).keys()]
    : (proposalsIds ?? []);
  // TODO: turn on for mainnets
  // try {
  //   return await Promise.all(
  //     ids.map(async (id) => {
  //       const data = await cachingLayer.getProposal({
  //         chainId: appConfig.govCoreChainId,
  //         governance: appConfig.govCoreConfig.contractAddress,
  //         proposalId: BigInt(id),
  //       });
  //       return {
  //         ...data,
  //         proposal: {
  //           ...data.proposal,
  //           id,
  //         },
  //       };
  //     }),
  //   );
  // } catch (e) {
  //   console.error(
  //     'Error getting proposal data for list with cache, using RPC fallback',
  //     e,
  //   );
  if (clients) {
    const proposalsData = await getProposalsDataRPC({
      proposalsCount,
      proposalsIds,
      clients,
    });
    return await Promise.all(
      proposalsData.map(async (proposal) => {
        return {
          proposal,
          // TODO: turn on
          // ipfs: {
          //   title: (await getProposalMetadata({ hash: proposal.ipfsHash }))
          //     .title,
          // },
          ipfs: {
            title: `Proposal ${proposal.id}`,
          },
        };
      }),
    );
  } else {
    throw new Error('Clients not passed. Try to pass clients and try again');
  }
  // }
}
