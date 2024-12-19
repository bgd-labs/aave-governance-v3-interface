import { z } from 'zod';

import { fetchPayloads } from '../../../requests/fetchPayloads';
import {
  FetchPayloadsTxHashes,
  fetchPayloadTxHashes,
} from '../../../requests/fetchPayloadTxHashes';
import { serverClients } from '../../../requests/utils/chains';
import { GetPayloadsData } from '../../../types';
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
  getTxHashes: publicProcedure
    .input(z.custom<Omit<FetchPayloadsTxHashes, 'clients'>>())
    .query(
      async (input) =>
        await fetchPayloadTxHashes({
          input: { ...input.input, clients: serverClients },
        }),
    ),
});
