import { Fetcher } from 'swr';

import { PayloadWithHashes } from '../../types';
import { fetchPayloadById, FetchPayloadByIdParams } from '../fetchPayloadById';

export const payloadByIdFetcher: Fetcher<
  PayloadWithHashes,
  FetchPayloadByIdParams
> = async (input) => {
  return await fetchPayloadById({ input });
};
