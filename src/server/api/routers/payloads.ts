import { z } from 'zod';

import { fetchPayloads } from '../../../requests/fetchPayloads';
import { serverClients } from '../../../requests/utils/chains';
import { GetPayloadsData } from '../../../requests/utils/getPayloadsData';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const payloadsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.custom<Omit<GetPayloadsData, 'clients'>>())
    .query(
      async (input) =>
        await fetchPayloads({
          input: { ...input.input, clients: serverClients },
        }),
    ),
});
