import { z } from 'zod';

import { appConfig } from '../../../configs/appConfig';
import { fetchProposalsBalancesByUser } from '../../../requests/fetchProposalsBalancesByUser';
import { serverClients } from '../../../requests/utils/chains';
import { GetVotingPowerWithDelegationByBlockHash } from '../../../requests/utils/getVotingPowerWithDelegationByBlockHash';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const proposalsRouter = createTRPCRouter({
  getBalances: publicProcedure
    .input(z.custom<Omit<GetVotingPowerWithDelegationByBlockHash, 'client'>>())
    .query(
      async (input) =>
        await fetchProposalsBalancesByUser({
          input: {
            ...input.input,
            client: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
});
