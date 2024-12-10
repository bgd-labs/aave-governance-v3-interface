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
    // TODO: API not implemented
    return await getVotingPowerWithDelegationByBlockHashRPC({ ...input });
  } catch (e) {
    console.error(
      'Error getting proposals balances by user from API, using RPC fallback',
      e,
    );
    return await getVotingPowerWithDelegationByBlockHashRPC({ ...input });
  }
}
