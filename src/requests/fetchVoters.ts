import { GetVotersRPC, getVotersRPC } from './utils/getVotersRPC';

export async function fetchVoters({ input }: { input: GetVotersRPC }) {
  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error('Error getting voters list from API, using RPC fallback', e);
    return await getVotersRPC({ ...input });
  }
}
