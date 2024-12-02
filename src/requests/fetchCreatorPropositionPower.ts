import {
  GetCreatorPropositionPower,
  getCreatorPropositionPowerRPC,
} from './utils/getOwnerPropositionPowerRPC';

export async function fetchCreatorPropositionPower({
  input,
}: {
  input: GetCreatorPropositionPower;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting proposals balances by user from API, using RPC fallback',
      e,
    );
    return await getCreatorPropositionPowerRPC({ ...input });
  }
}
