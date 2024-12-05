import {
  GetCurrentUserPowersRPC,
  getCurrentUserPowersRPC,
} from './utils/getCurrentUserPowersRPC';

export async function fetchCurrentUserPowers({
  input,
}: {
  input: GetCurrentUserPowersRPC;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting current user powers from API, using RPC fallback',
      e,
    );
    return await getCurrentUserPowersRPC({ ...input });
  }
}
