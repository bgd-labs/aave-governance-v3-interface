import { Address, Client, Hex } from 'viem';

import { getVotingPowerWithDelegationByBlockHashRPC } from './utils/getVotingPowerWithDelegationByBlockHashRPC';

export type FetchProposalsBalancesByUser = {
  client: Client;
  blockHash: Hex;
  address: Address;
  assets: Address[];
};

export async function fetchProposalsBalancesByUser({
  input,
}: {
  input: FetchProposalsBalancesByUser;
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
