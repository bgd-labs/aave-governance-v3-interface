import {
  GetVotingPowerWithDelegationByBlockHashRPC,
  getVotingPowerWithDelegationByBlockHashRPC,
} from './utils/getVotingPowerWithDelegationByBlockHashRPC';

export async function fetchProposalsBalancesByUser({
  input,
}: {
  input: GetVotingPowerWithDelegationByBlockHashRPC;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposals balances by user from API, using RPC fallback',
      e,
    );
    return await getVotingPowerWithDelegationByBlockHashRPC({ ...input });
  }
}
