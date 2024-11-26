import { z } from 'zod';

import {
  FetchDataForCreateProposalScreen,
  fetchDataForCreateProposalScreen,
} from '../../../requests/fetchDataForCreateProposalScreen';
import { serverClients } from '../../../requests/utils/chains';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const createProposalRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.custom<Omit<FetchDataForCreateProposalScreen, 'clients'>>())
    .query(
      async (input) =>
        await fetchDataForCreateProposalScreen({
          input: { ...input.input, clients: serverClients },
        }),
    ),
});
