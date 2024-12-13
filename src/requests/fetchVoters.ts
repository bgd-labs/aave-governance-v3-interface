import { formatUnits } from 'viem';

import { DECIMALS, INITIAL_API_URL } from '../configs/configs';
import { VoterAPI } from '../types';
import { GetVotersRPC, getVotersRPC } from './utils/getVotersRPC';

export async function fetchVoters({ input }: { input: GetVotersRPC }) {
  try {
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
  } catch (e) {
    console.error('Error getting voters list from API, using RPC fallback', e);
    return await getVotersRPC({ ...input });
  }
}
