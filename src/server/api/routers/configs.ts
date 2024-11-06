import { Client } from 'viem';
import { z } from 'zod';

import { fetchInitialData } from '../../../requests/fetchInitialData';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const configsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ govCoreClient: z.custom<Client>() }))
    .query(async ({ input }) => await fetchInitialData({ input })),
});
