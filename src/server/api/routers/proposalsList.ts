import { z } from 'zod';

import { fetchUserProposalData } from '../../../requests/fetchUserProposalData';
import { GetVMProposalsData } from '../../../requests/utils/getVMProposalsData';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const proposalsListRouter = createTRPCRouter({
  getAll: publicProcedure
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
    .input(z.custom<GetVMProposalsData>()) // TODO: server clients
    .query(async (input) => await fetchUserProposalData(input)),
});
