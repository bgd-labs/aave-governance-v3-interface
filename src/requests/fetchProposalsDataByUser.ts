import { GetVotingDataRPC, getVotingDataRPC } from './utils/getVotingDataRPC';

export async function fetchProposalsDataByUser({
  input,
}: {
  input: GetVotingDataRPC;
}) {
  try {
    throw new Error('TODO: API not implemented');
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
