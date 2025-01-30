import {
  GetDelegationDataRPC,
  getDelegationDataRPC,
} from './utils/getDelegationDataRPC';

export async function fetchDelegationData({
  input,
}: {
  input: GetDelegationDataRPC;
}) {
  try {
    // TODO: API not implemented
    return await getDelegationDataRPC({ ...input });
  } catch (e) {
    console.error(
      'Error getting representations data by user from API, using RPC fallback',
      e,
    );
    return await getDelegationDataRPC({ ...input });
  }
}
