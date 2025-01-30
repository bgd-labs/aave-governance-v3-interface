import { z } from 'zod';

import { appConfig } from '../../../configs/appConfig';
import {
  FetchRepresentationsData,
  fetchRepresentationsData,
} from '../../../requests/fetchRepresentationsData';
import { serverClients } from '../../../requests/utils/chains';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const representationsRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.custom<Omit<FetchRepresentationsData, 'govCoreClient'>>())
    .query(
      async (input) =>
        await fetchRepresentationsData({
          input: {
            ...input.input,
            govCoreClient: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
});
