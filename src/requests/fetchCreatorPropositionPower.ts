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
    // TODO: API not implemented
    return await getCreatorPropositionPowerRPC({ ...input });
  } catch (e) {
    console.error(
      'Error getting proposals balances by user from API, using RPC fallback',
      e,
    );
    return await getCreatorPropositionPowerRPC({ ...input });
  }
}
