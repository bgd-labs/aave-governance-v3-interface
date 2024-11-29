import { z } from 'zod';

import { fetchActiveProposalsDataForList } from '../../../requests/fetchActiveProposalsDataForList';
import {
  fetchProposalsDataForList,
  FetchProposalsDataForListParams,
} from '../../../requests/fetchProposalsDataForList';
import { serverClients } from '../../../requests/utils/chains';
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
    .input(
      z.custom<
        Omit<
          FetchProposalsDataForListParams,
          'clients' | 'proposalsIds' | 'proposalsCount'
        > & {
          activeIds: number[];
        }
      >(),
    )
    .query(
      async (input) =>
        await fetchActiveProposalsDataForList({
          input: { ...input.input, clients: serverClients },
        }),
    ),
});
