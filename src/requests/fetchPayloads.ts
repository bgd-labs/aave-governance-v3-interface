import { GetPayloadsData } from '../types';
import { getPayloadsDataRPC } from './utils/getPayloadsDataRPC';

export async function fetchPayloads({ input }: { input: GetPayloadsData }) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting payloads data from API, using RPC fallback',
      e,
    );
    return await getPayloadsDataRPC({ ...input });
  }
}
