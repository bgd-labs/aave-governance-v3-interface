import { z } from 'zod';

import {
  fetchAllPayloadsCounts,
  FetchAllPayloadsCountsParams,
} from '../../../requests/fetchAllPayloadsCounts';
import {
  fetchFilteredPayloadsData,
  FetchFilteredPayloadsDataParams,
} from '../../../requests/fetchFilteredPayloadsData';
import {
  fetchPayloadById,
  FetchPayloadByIdParams,
} from '../../../requests/fetchPayloadById';
import { fetchPayloads } from '../../../requests/fetchPayloads';
import {
  fetchPayloadsCount,
  FetchPayloadsCountParams,
} from '../../../requests/fetchPayloadsCount';
import {
  FetchPayloadsTxHashes,
  fetchPayloadTxHashes,
} from '../../../requests/fetchPayloadTxHashes';
import { serverClients } from '../../../requests/utils/chains';
import { GetPayloadsData } from '../../../requests/utils/getPayloadsDataRPC';
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
  getPaginated: publicProcedure
    .input(z.custom<Omit<FetchFilteredPayloadsDataParams, 'clients'>>())
    .query(
      async (input) =>
        await fetchFilteredPayloadsData({
          input: { ...input.input, clients: serverClients },
        }),
    ),
  getCount: publicProcedure
    .input(z.custom<Omit<FetchPayloadsCountParams, 'clients'>>())
    .query(
      async (input) =>
        await fetchPayloadsCount({
          input: { ...input.input, clients: serverClients },
        }),
    ),
  getTotalCount: publicProcedure
    .input(z.custom<Omit<FetchAllPayloadsCountsParams, 'clients'>>())
    .query(
      async (input) =>
        await fetchAllPayloadsCounts({
          input: { ...input.input, clients: serverClients },
        }),
    ),
  getById: publicProcedure
    .input(z.custom<Omit<FetchPayloadByIdParams, 'clients'>>())
    .query(
      async (input) =>
        await fetchPayloadById({
          input: { ...input.input, clients: serverClients },
        }),
    ),
});
