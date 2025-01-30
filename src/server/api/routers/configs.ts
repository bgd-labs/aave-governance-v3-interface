import { z } from 'zod';

import { appConfig } from '../../../configs/appConfig';
import { fetchConfigs } from '../../../requests/fetchConfigs';
import { fetchTotalProposalsCount } from '../../../requests/fetchTotalProposalsCount';
import { serverClients } from '../../../requests/utils/chains';
import { createTRPCRouter, publicProcedure } from '../trpc';

const input = {
  input: { govCoreClient: serverClients[appConfig.govCoreChainId] },
};

export const configsRouter = createTRPCRouter({
  get: publicProcedure.query(async () => await fetchConfigs(input)),
  getProposalsCount: publicProcedure
    .input(z.object({ rpcOnly: z.boolean().or(z.undefined()) }))
    .query(async () => await fetchTotalProposalsCount(input)),
});
