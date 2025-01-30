import { Client, Hex } from 'viem';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { GetProposalInitialResponse } from '../server/api/types';
import { ProposalMetadata } from '../types';
import { getProposalFormattedData } from './utils/formatDataFromAPI';
import { getProposalsDataRPC } from './utils/getProposalsDataRPC';

export type FetchProposalByIdParams = {
  proposalId: number;
  govCoreClient: Client;
};

export async function fetchProposalById({
  input,
}: {
  input: FetchProposalByIdParams;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      const url = `${INITIAL_API_URL}/proposals/${input.proposalId}/get/`;
      const dataRaw = await fetch(url);
      const data = (await dataRaw.json())[0] as GetProposalInitialResponse &
        ProposalMetadata & { originalIpfsHash: string | null };

      const formattedData = {
        ...data,
        ipfsHash: data.originalIpfsHash as Hex,
      };

      if (!formattedData.ipfsHash) {
        throw new Error(
          `Something went wrong when fetching proposal ${input.proposalId} from API.`,
        );
      }
      return [
        {
          ...getProposalFormattedData(formattedData),
        },
      ];
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error(
      'Error getting proposal data by id from API, using RPC fallback',
      e,
    );
    return await getProposalsDataRPC({
      proposalsIds: [input.proposalId],
      clients: { [appConfig.govCoreChainId]: input.govCoreClient },
    });
  }
}
