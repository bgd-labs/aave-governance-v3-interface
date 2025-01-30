import { z } from 'zod';

import { appConfig } from '../../../configs/appConfig';
import {
  fetchCreationFeesByCreator,
  FetchCreationFeesParams,
} from '../../../requests/fetchCreationFeesByCreator';
import { fetchCurrentUserPowers } from '../../../requests/fetchCurrentUserPowers';
import { serverClients } from '../../../requests/utils/chains';
import { GetCurrentUserPowersRPC } from '../../../requests/utils/getCurrentUserPowersRPC';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const walletRouter = createTRPCRouter({
  getCurrentPowers: publicProcedure
    .input(z.custom<Omit<GetCurrentUserPowersRPC, 'govCoreClient'>>())
    .query(
      async (input) =>
        await fetchCurrentUserPowers({
          input: {
            ...input.input,
            govCoreClient: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
  getAvailableProposalsToReturnFeeByCreator: publicProcedure
    .input(z.custom<FetchCreationFeesParams>())
    .query(
      async (input) =>
        await fetchCreationFeesByCreator({
          input: {
            ...input.input,
          },
        }),
    ),
});
