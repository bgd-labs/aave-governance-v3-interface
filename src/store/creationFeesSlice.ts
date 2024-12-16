import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Address } from 'viem';

import { isForIPFS } from '../configs/appConfig';
import { fetchCreationFeesByCreator } from '../requests/fetchCreationFeesByCreator';
import { api } from '../trpc/client';
import { CreationFee, CreationFeeState } from '../types';
import { selectCreationFeesDataByCreator } from './selectors/creationFeesSelectors';

export interface ICreationFeesSlice {
  creationFeesDataLoading: Record<Address, boolean>;
  creationFeesData: Record<Address, Record<number, CreationFee>>;
  getCreationFeesData: (creator: string) => Promise<void>;
  updateCreationFeesDataByCreator: (
    creator: Address,
    ids?: number[],
  ) => Promise<void>;

  dataByCreatorLength: Record<Address, number>;
  setDataByCreatorLength: (creator: Address, length: number) => void;
}

export const creationFeesSlice: StoreSlice<ICreationFeesSlice> = (
  set,
  get,
) => ({
  creationFeesDataLoading: {},
  creationFeesData: {},
  getCreationFeesData: async (creator) => {
    const cr = creator.toLowerCase() as Address;

    if (typeof get().creationFeesDataLoading[cr] === 'undefined') {
      set((state) =>
        produce(state, (draft) => {
          draft.creationFeesDataLoading[cr] = true;
        }),
      );
    }

    const creationFeesData = await (isForIPFS
      ? fetchCreationFeesByCreator({ input: { creator } })
      : api.wallet.getAvailableProposalsToReturnFeeByCreator.query({
          creator,
        }));

    set((state) =>
      produce(state, (draft) => {
        (creationFeesData ?? []).forEach((data) => {
          if (data) {
            draft.creationFeesData[cr] = {
              ...draft.creationFeesData[cr],
              [data.proposalId]: {
                ...data,
              },
            };
          }
        });
      }),
    );

    set((state) =>
      produce(state, (draft) => {
        draft.creationFeesDataLoading[cr] = false;
      }),
    );
  },

  updateCreationFeesDataByCreator: async (creator, ids) => {
    const cr = creator.toLowerCase() as Address;

    set((state) =>
      produce(state, (draft) => {
        draft.creationFeesDataLoading[cr] = false;
      }),
    );

    const creatorData = selectCreationFeesDataByCreator({
      creator,
      creationFeesData: get().creationFeesData,
    });

    const filteredData = Object.values(creatorData)
      .filter((data) => data.status < CreationFeeState.RETURNED)
      .filter((data) => (ids ? ids.includes(data.proposalId) : true));

    filteredData.forEach((data) => {
      if (data) {
        set((state) =>
          produce(state, (draft) => {
            draft.creationFeesData[cr] = {
              ...draft.creationFeesData[cr],
              [data.proposalId]: {
                ...data,
              },
            };
          }),
        );
      }
    });
  },

  dataByCreatorLength: {},
  setDataByCreatorLength: (creator, length) => {
    if (get().dataByCreatorLength[creator] !== length) {
      set((state) =>
        produce(state, (draft) => {
          draft.dataByCreatorLength[creator] = length;
        }),
      );
    }
  },
});
