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
    // TODO: API not implemented
    return await getCurrentUserPowersRPC({ ...input });
  } catch (e) {
    console.error(
      'Error getting current user powers from API, using RPC fallback',
      e,
    );
    return await getCurrentUserPowersRPC({ ...input });
  }
}
