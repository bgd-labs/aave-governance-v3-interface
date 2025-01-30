import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';
import { mainnet } from 'viem/chains';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL } from '../configs/configs';
import { ProposalToGetUserData } from '../types';
import { getVotingDataRPC } from './utils/getVotingDataRPC';

type FetchProposalsDataByUser = {
  initialProposals: ProposalToGetUserData[];
  walletAddress?: string;
  clients: ClientsRecord;
  rpcOnly?: boolean;
};

export async function fetchProposalsDataByUser({
  input,
}: {
  input: FetchProposalsDataByUser;
}) {
  try {
    if (appConfig.govCoreChainId === mainnet.id) {
      if (input.rpcOnly) {
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
      } else {
        return await Promise.all(
          input.initialProposals.map(async (proposal) => {
            const url = `${INITIAL_API_URL}/voting/${proposal.id}/${proposal.votingChainId}/${appConfig.votingMachineConfig[proposal.votingChainId].contractAddress}/${input.walletAddress}/voteInfo/`;
            const dataRaw = await fetch(url);
            const data = (await dataRaw.json())[0] as {
              support: boolean;
              votingPower: string;
            };

            return {
              proposalId: proposal.id,
              votedInfo: {
                support: data?.support ?? false,
                votedPower: BigInt(data?.votingPower ?? 0),
              },
              isVoted: (data?.votingPower ?? '0') !== '0',
            };
          }),
        );
      }
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
