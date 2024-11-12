import { z } from 'zod';

import { fetchUserProposalsBalances } from '../../../requests/fetchUserProposalsBalances';
import { GetVotingPowerWithDelegationByBlockHash } from '../../../requests/utils/getVotingPowerWithDelegationByBlockHash';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const proposalsRouter = createTRPCRouter({
  getBalances: publicProcedure
    .input(z.custom<GetVotingPowerWithDelegationByBlockHash>()) // TODO: server client
    .query(async (input) => await fetchUserProposalsBalances(input)),
});
