import { GetVotingData, getVotingData } from './utils/getVotingData';

export async function fetchProposalsDataByUser({
  input,
}: {
  input: GetVotingData;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposal data by user from API, using RPC fallback',
      e,
    );

    const preparedData = await getVotingData({ ...input });

    return preparedData.map((vmData) => {
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
