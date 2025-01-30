import { z } from 'zod';

import { appConfig } from '../../../configs/appConfig';
import { fetchDelegationData } from '../../../requests/fetchDelegationData';
import { serverClients } from '../../../requests/utils/chains';
import { GetDelegationDataRPC } from '../../../requests/utils/getDelegationDataRPC';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const delegationRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.custom<Omit<GetDelegationDataRPC, 'govCoreClient'>>())
    .query(
      async (input) =>
        await fetchDelegationData({
          input: {
            ...input.input,
            govCoreClient: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
});
