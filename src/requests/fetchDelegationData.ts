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
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting representations data by user from API, using RPC fallback',
      e,
    );
    return await getDelegationDataRPC({ ...input });
  }
}
