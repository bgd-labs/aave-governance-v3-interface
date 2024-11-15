import {
  GetVotingPowerWithDelegationByBlockHash,
  getVotingPowerWithDelegationByBlockHash,
} from './utils/getVotingPowerWithDelegationByBlockHash';

export async function fetchProposalsBalancesByUser({
  input,
}: {
  input: GetVotingPowerWithDelegationByBlockHash;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposals balances by user from API, using RPC fallback',
      e,
    );
    return await getVotingPowerWithDelegationByBlockHash({ ...input });
  }
}
