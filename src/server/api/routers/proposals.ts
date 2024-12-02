import { z } from 'zod';

import { appConfig } from '../../../configs/appConfig';
import { fetchCreatorPropositionPower } from '../../../requests/fetchCreatorPropositionPower';
import {
  fetchProposalById,
  FetchProposalByIdParams,
} from '../../../requests/fetchProposalById';
import {
  fetchProposalDataForDetails,
  FetchProposalsDataForDetailsParams,
} from '../../../requests/fetchProposalDataForDetails';
import { fetchProposalsBalancesByUser } from '../../../requests/fetchProposalsBalancesByUser';
import { fetchProposalsDataByUser } from '../../../requests/fetchProposalsDataByUser';
import { serverClients } from '../../../requests/utils/chains';
import { GetCreatorPropositionPower } from '../../../requests/utils/getOwnerPropositionPowerRPC';
import { GetVotingDataRPC } from '../../../requests/utils/getVotingDataRPC';
import { GetVotingPowerWithDelegationByBlockHashRPC } from '../../../requests/utils/getVotingPowerWithDelegationByBlockHashRPC';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const proposalsRouter = createTRPCRouter({
  getWalletBalancesForProposal: publicProcedure
    .input(
      z.custom<Omit<GetVotingPowerWithDelegationByBlockHashRPC, 'client'>>(),
    )
    .query(
      async (input) =>
        await fetchProposalsBalancesByUser({
          input: {
            ...input.input,
            client: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
  getProposalVotedData: publicProcedure
    .input(z.custom<Omit<GetVotingDataRPC, 'clients'>>())
    .query(
      async (input) =>
        await fetchProposalsDataByUser({
          input: { ...input.input, clients: serverClients },
        }),
    ),
  getProposalById: publicProcedure
    .input(z.custom<Omit<FetchProposalByIdParams, 'govCoreClient'>>())
    .query(
      async (input) =>
        await fetchProposalById({
          input: {
            ...input.input,
            govCoreClient: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
  getDetails: publicProcedure
    .input(z.custom<Omit<FetchProposalsDataForDetailsParams, 'clients'>>())
    .query(
      async (input) =>
        await fetchProposalDataForDetails({
          input: {
            ...input.input,
            clients: serverClients,
          },
        }),
    ),
  getCreatorPropositionPower: publicProcedure
    .input(z.custom<Omit<GetCreatorPropositionPower, 'govCoreClient'>>())
    .query(
      async (input) =>
        await fetchCreatorPropositionPower({
          input: {
            ...input.input,
            govCoreClient: serverClients[appConfig.govCoreChainId],
          },
        }),
    ),
});
