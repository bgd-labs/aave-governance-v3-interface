import { Fetcher } from 'swr';

import { PayloadWithHashes } from '../../types';
import {
  fetchFilteredPayloadsData,
  FetchFilteredPayloadsDataParams,
} from '../fetchFilteredPayloadsData';

export const filteredPayloadsDataFetcher: Fetcher<
  {
    data: PayloadWithHashes[];
    count: number;
    ids: number[];
  },
  FetchFilteredPayloadsDataParams
> = async (input) => {
  return await fetchFilteredPayloadsData({ input });
};
