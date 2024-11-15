import { appConfig } from '../../../configs/appConfig';
import { fetchInitialData } from '../../../requests/fetchInitialData';
import { serverClients } from '../../../requests/utils/chains';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const configsRouter = createTRPCRouter({
  get: publicProcedure.query(
    async () =>
      await fetchInitialData({
        input: { govCoreClient: serverClients[appConfig.govCoreChainId] },
      }),
  ),
});
