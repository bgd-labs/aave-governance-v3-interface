import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { formatUnits } from 'viem';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { DECIMALS, INITIAL_API_URL } from '../configs/configs';
import { VoterAPI } from '../server/api/types';
import { getVotersRPC } from './utils/getVotersRPC';

export type FetchVoters = {
  clients: ClientsRecord;
  proposalId: number;
  votingChainId: number;
  startBlockNumber: number;
  endBlockNumber?: number;
  lastBlockNumber?: number;
  rpcOnly?: boolean;
};

export async function fetchVoters({ input }: { input: FetchVoters }) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      if (input.rpcOnly) {
        return await getVotersRPC({ ...input });
      } else {
        const url = `${INITIAL_API_URL}/voting/${input.proposalId}/allVoters/`;
        const dataRaw = await fetch(url);
        const data = (await dataRaw.json()) as VoterAPI[];
        return data.map((vote) => {
          return {
            proposalId: input.proposalId,
            address: vote.voter,
            support: vote.support,
            votingPower: +formatUnits(BigInt(vote.votingPower), DECIMALS),
            transactionHash: vote.txHash,
            blockNumber: input.startBlockNumber,
            chainId: input.votingChainId,
            ensName: undefined,
          };
        });
      }
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error('Error getting voters list from API, using RPC fallback', e);
    return await getVotersRPC({ ...input });
  }
}
