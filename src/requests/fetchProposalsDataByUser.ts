import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { GetVotingDataRPC, getVotingDataRPC } from './utils/getVotingDataRPC';

export async function fetchProposalsDataByUser({
  input,
}: {
  input: GetVotingDataRPC;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      return await Promise.all(
        input.initialProposals.map(async (proposal) => {
          const url = `${INITIAL_API_URL}/voting/${proposal.id}/${proposal.votingChainId}/${appConfig.votingMachineConfig[proposal.votingChainId].contractAddress}/${input.walletAddress}/voteInfo/`;
          const dataRaw = await fetch(url);
          const data = (await dataRaw.json()) as {
            support: boolean;
            votingPower: string;
          }[];

          return {
            proposalId: proposal.id,
            votedInfo: {
              support: data[0]?.support ?? false,
              votedPower: BigInt(data[0]?.votingPower ?? 0),
            },
            isVoted: data[0]?.votingPower !== '0',
          };
        }),
      );
    }
    throw new Error('This chain id for gov core not supported by API');
  } catch (e) {
    console.error(
      'Error getting proposal data by user from API, using RPC fallback',
      e,
    );
    return (await getVotingDataRPC({ ...input })).map((vmData) => {
      return {
        proposalId: vmData.proposalData.id,
        votedInfo: {
          support: vmData.votedInfo.support,
          votedPower: vmData.votedInfo.votingPower,
        },
        isVoted: vmData.votedInfo.votingPower !== 0n,
      };
    });
  }
}
