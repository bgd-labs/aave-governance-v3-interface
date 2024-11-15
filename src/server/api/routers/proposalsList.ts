import { z } from 'zod';

import { fetchProposalsDataByUser } from '../../../requests/fetchProposalsDataByUser';
import {
  fetchProposalsDataForList,
  FetchProposalsDataForListParams,
} from '../../../requests/fetchProposalsDataForList';
import { serverClients } from '../../../requests/utils/chains';
import { GetVotingData } from '../../../requests/utils/getVotingData';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const proposalsListRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.custom<Omit<FetchProposalsDataForListParams, 'clients'>>())
    .query(
      async (input) =>
        await fetchProposalsDataForList({
          input: { ...input.input, clients: serverClients },
        }),
    ),

  getActive: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async () => {
      try {
        throw new Error('TODO: not implemented');
      } catch (e) {
        console.error(
          'Error getting proposals list data from API, using RPC fallback',
          e,
        );
      }
    }),

  getUserData: publicProcedure
    .input(z.custom<Omit<GetVotingData, 'clients'>>())
    .query(
      async (input) =>
        await fetchProposalsDataByUser({
          input: { ...input.input, clients: serverClients },
        }),
    ),
});
