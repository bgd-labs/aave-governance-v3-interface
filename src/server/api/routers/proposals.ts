import { z } from 'zod';

import { appConfig } from '../../../configs/appConfig';
import {
  fetchProposalById,
  FetchProposalByIdParams,
} from '../../../requests/fetchProposalById';
import { fetchProposalsBalancesByUser } from '../../../requests/fetchProposalsBalancesByUser';
import { serverClients } from '../../../requests/utils/chains';
import { GetVotingPowerWithDelegationByBlockHashRPC } from '../../../requests/utils/getVotingPowerWithDelegationByBlockHashRPC';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const proposalsRouter = createTRPCRouter({
  getBalances: publicProcedure
    .input(
      z.custom<Omit<GetVotingPowerWithDelegationByBlockHashRPC, 'client'>>(),
    )
    .query(
      async (input) =>
        await fetchProposalsBalancesByUser({
          input: {
            ...input.input,
            client: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
  getProposalById: publicProcedure
    .input(z.custom<Omit<FetchProposalByIdParams, 'govCoreClient'>>())
    .query(
      async (input) =>
        await fetchProposalById({
          input: {
            ...input.input,
            govCoreClient: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
});
