import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const proposalsListRouter = createTRPCRouter({
  getProposals: publicProcedure
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
});
