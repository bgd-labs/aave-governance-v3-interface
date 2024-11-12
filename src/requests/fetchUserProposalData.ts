import {
  GetVMProposalsData,
  getVMProposalsData,
} from './utils/getVMProposalsData';

export async function fetchUserProposalData({
  input,
}: {
  input: GetVMProposalsData;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting user proposal data from API, using RPC fallback',
      e,
    );

    const preparedData = await getVMProposalsData({ ...input });

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
