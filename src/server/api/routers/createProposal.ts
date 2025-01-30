import { z } from 'zod';

import {
  FetchDataForCreateOverviewScreen,
  fetchDataForCreateOverviewScreen,
} from '../../../requests/fetchDataForCreateOverview';
import {
  FetchDataForCreateProposalScreen,
  fetchDataForCreateProposalScreen,
} from '../../../requests/fetchDataForCreateProposalScreen';
import { serverClients } from '../../../requests/utils/chains';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const createProposalRouter = createTRPCRouter({
  getForCreate: publicProcedure
    .input(z.custom<Omit<FetchDataForCreateProposalScreen, 'clients'>>())
    .query(
      async (input) =>
        await fetchDataForCreateProposalScreen({
          input: { ...input.input, clients: serverClients },
        }),
    ),
  getForCreateOverview: publicProcedure
    .input(z.custom<Omit<FetchDataForCreateOverviewScreen, 'clients'>>())
    .query(
      async (input) =>
        await fetchDataForCreateOverviewScreen({
          input: { ...input.input, clients: serverClients },
        }),
    ),
});
