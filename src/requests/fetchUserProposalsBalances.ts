import {
  GetVotingPowerWithDelegationByBlockHash,
  getVotingPowerWithDelegationByBlockHash,
} from './utils/getVotingPowerWithDelegationByBlockHash';

export async function fetchUserProposalsBalances({
  input,
}: {
  input: GetVotingPowerWithDelegationByBlockHash;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting user proposals balances from API, using RPC fallback',
      e,
    );
    return await getVotingPowerWithDelegationByBlockHash({ ...input });
  }
}
