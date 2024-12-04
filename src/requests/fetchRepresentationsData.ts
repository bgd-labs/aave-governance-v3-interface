import {
  GetRepresentationDataRPC,
  getRepresentationDataRPC,
} from './utils/getRepresentationDataRPC';

export async function fetchRepresentationsData({
  input,
}: {
  input: GetRepresentationDataRPC;
}) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting representations data by user from API, using RPC fallback',
      e,
    );
    return await getRepresentationDataRPC({ ...input });
  }
}
