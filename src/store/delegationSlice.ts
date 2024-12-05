import {
  safeSdkOptions,
  StoreSlice,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';
import { default as Sdk } from '@safe-global/safe-apps-sdk';
import { produce } from 'immer';
import isEqual from 'lodash/isEqual';

import { appConfig, isForIPFS } from '../configs/appConfig';
import { getDelegateTxParams } from '../helpers/getDelegateTxParams';
import { fetchDelegationData } from '../requests/fetchDelegationData';
import { batchMetaDelegate } from '../transactions/actions/batchMetaDelegate';
import { delegate } from '../transactions/actions/delegate';
import { delegateMetaSig } from '../transactions/actions/delegateMetaSig';
import { api } from '../trpc/client';
import {
  BatchMetaDelegateParams,
  DelegateData,
  DelegateDataParams,
  DelegateItem,
  GovernancePowerTypeApp,
} from '../types';
import { IEnsSlice } from './ensSlice';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectInputToAddress } from './selectors/ensSelectors';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { TransactionsSlice, TxType } from './transactionsSlice';
import { IUISlice } from './uiSlice';
import { IWeb3Slice } from './web3Slice';

export interface IDelegationSlice {
  delegateData: DelegateItem[];
  delegateDataLoading: boolean;
  getDelegateData: () => Promise<void>;
  prepareDataForDelegation: (
    formDelegateData: DelegateData[],
  ) => Promise<DelegateDataParams[]>;
  delegate: (
    stateDelegateData: DelegateItem[],
    formDelegateData: DelegateData[],
    timestamp: number,
  ) => Promise<void>;

  // for validation
  incorrectDelegationToFields: string[];
  addDelegationIncorrectToField: (field: string) => void;
  removeDelegationIncorrectToField: (field: string) => void;
  clearDelegationIncorrectToFields: () => void;

  isDelegateModalOpen: boolean;
  setDelegateModalOpen: (value: boolean) => void;
  isDelegateChangedView: boolean;
  setIsDelegateChangedView: (value: boolean) => void;
}

export const createDelegationSlice: StoreSlice<
  IDelegationSlice,
  IWeb3Slice & TransactionsSlice & IUISlice & IEnsSlice & IRpcSwitcherSlice
> = (set, get) => ({
  delegateData: [],
  delegateDataLoading: false,
  getDelegateData: async () => {
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      set({ delegateDataLoading: true });

      const delegateData = await (isForIPFS
        ? fetchDelegationData({
            input: {
              walletAddress: activeAddress,
              govCoreClient: selectAppClients(get())[appConfig.govCoreChainId],
            },
          })
        : api.delegation.get.query({ walletAddress: activeAddress }));

      set({ delegateData });
      setTimeout(() => set({ delegateDataLoading: false }), 1);
    } else {
      set({ delegateData: [] });
    }
  },

  prepareDataForDelegation: async (formDelegateData) => {
    const activeAddress = get().activeWallet?.address;

    const data: DelegateDataParams[] = [];

    if (activeAddress) {
      for await (const formDelegateItem of formDelegateData) {
        const { underlyingAsset } = formDelegateItem;

        const votingToAddress = await selectInputToAddress({
          store: get(),
          activeAddress,
          addressTo: formDelegateItem.votingToAddress,
        });
        const propositionToAddress = await selectInputToAddress({
          store: get(),
          activeAddress,
          addressTo: formDelegateItem.propositionToAddress,
        });

        // get previous delegation data for current asset
        const delegateData: DelegateItem = get().delegateData.filter(
          (data) => data.underlyingAsset === underlyingAsset,
        )[0];

        const isAddressSame =
          votingToAddress.toLowerCase() === propositionToAddress.toLowerCase();
        const isInitialAddressSame =
          delegateData.propositionToAddress.toLowerCase() ===
          delegateData.votingToAddress.toLowerCase();
        const isVotingToAddressSame =
          delegateData.votingToAddress.toLowerCase() ===
          votingToAddress.toLowerCase();
        const isPropositionToAddressSame =
          delegateData.propositionToAddress.toLowerCase() ===
          propositionToAddress.toLowerCase();

        // check if delegationTo is the same address and not equal to previous delegation
        if (
          isAddressSame &&
          (!isInitialAddressSame ||
            votingToAddress !== delegateData.votingToAddress)
        ) {
          data.push({
            underlyingAsset,
            delegator: activeAddress,
            delegatee: votingToAddress === '' ? activeAddress : votingToAddress,
            delegationType: GovernancePowerTypeApp.All,
          });
        } else {
          // if delegationTo are different addresses
          // check if need to re-delegate voting
          if (!isVotingToAddressSame) {
            data.push({
              underlyingAsset,
              delegator: activeAddress,
              delegatee:
                votingToAddress === '' ? activeAddress : votingToAddress,
              delegationType: GovernancePowerTypeApp.VOTING,
            });
          }
          // check if need to re-delegate proposition
          if (!isPropositionToAddressSame) {
            data.push({
              underlyingAsset,
              delegator: activeAddress,
              delegatee:
                propositionToAddress === ''
                  ? activeAddress
                  : propositionToAddress,
              delegationType: GovernancePowerTypeApp.PROPOSITION,
              increaseNonce:
                !isVotingToAddressSame && !isPropositionToAddressSame,
            });
          }
        }
      }
    }

    return data;
  },

  delegate: async (stateDelegateData, formDelegateData, timestamp) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const activeAddress = get().activeWallet?.address;
    const isWalletAddressContract = get().activeWallet?.isContractAddress;
    const data = await get().prepareDataForDelegation(formDelegateData);

    if (activeAddress && !isWalletAddressContract) {
      if (data.length === 1) {
        await get().executeTx({
          body: () => {
            return delegate({
              wagmiConfig: get().wagmiConfig,
              underlyingAsset: data[0].underlyingAsset,
              delegateToAddress: data[0].delegatee,
              type: data[0].delegationType,
            });
          },
          params: {
            type: TxType.delegate,
            desiredChainID: appConfig.govCoreChainId,
            payload: {
              delegateData: stateDelegateData,
              formDelegateData,
              timestamp,
            },
          },
        });
      } else {
        const sigs: BatchMetaDelegateParams[] = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const sig = await delegateMetaSig({
            wagmiConfig: get().wagmiConfig,
            underlyingAsset: item.underlyingAsset,
            delegateToAddress: item.delegatee,
            delegationType: item.delegationType,
            activeAddress: item.delegator,
            increaseNonce: item.increaseNonce,
            govCoreClient: selectAppClients(get())[appConfig.govCoreChainId],
          });
          if (sig) {
            sigs.push(sig);
          }
        }

        if (sigs.length) {
          await get().executeTx({
            body: () => {
              return batchMetaDelegate({
                wagmiConfig: get().wagmiConfig,
                sigs,
              });
            },
            params: {
              type: TxType.delegate,
              desiredChainID: appConfig.govCoreChainId,
              payload: {
                delegateData: stateDelegateData,
                formDelegateData,
                timestamp,
              },
            },
          });
        }
      }
    } else if (activeAddress && isWalletAddressContract) {
      if (get().activeWallet?.walletType === WalletType.Safe) {
        const safeSdk = new Sdk(safeSdkOptions);

        const txsData = data.map((item) => {
          const txData = getDelegateTxParams(
            item.delegatee,
            item.delegationType,
          );
          return {
            to: item.underlyingAsset,
            value: '0',
            data: txData,
          };
        });

        await get().executeTx({
          body: () => {
            return safeSdk.txs.send({ txs: txsData });
          },
          params: {
            type: TxType.delegate,
            desiredChainID: appConfig.govCoreChainId,
            payload: {
              delegateData: stateDelegateData,
              formDelegateData,
              timestamp,
            },
          },
        });
      } else {
        if (data.length > 1) {
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (!isEqual(item, data[data.length - 1])) {
              await delegate({
                wagmiConfig: get().wagmiConfig,
                underlyingAsset: item.underlyingAsset,
                delegateToAddress: item.delegatee,
                type: item.delegationType,
              });
            }
          }
        }

        await get().executeTx({
          body: () => {
            return delegate({
              wagmiConfig: get().wagmiConfig,
              underlyingAsset: data[data.length - 1].underlyingAsset,
              delegateToAddress: data[data.length - 1].delegatee,
              type: data[data.length - 1].delegationType,
            });
          },
          params: {
            type: TxType.delegate,
            desiredChainID: appConfig.govCoreChainId,
            payload: {
              delegateData: stateDelegateData,
              formDelegateData,
              timestamp,
            },
          },
        });
      }
    }
  },

  incorrectDelegationToFields: [],
  addDelegationIncorrectToField: (field) => {
    set((state) =>
      produce(state, (draft) => {
        draft.incorrectDelegationToFields.push(field);
      }),
    );
  },
  removeDelegationIncorrectToField: (field) => {
    if (get().incorrectDelegationToFields.includes(field)) {
      set((state) => ({
        incorrectDelegationToFields: state.incorrectDelegationToFields.filter(
          (incorrectField) => incorrectField !== field,
        ),
      }));
    }
  },
  clearDelegationIncorrectToFields: () => {
    set({ incorrectDelegationToFields: [] });
  },

  isDelegateModalOpen: false,
  setDelegateModalOpen: (value) => {
    set({ isDelegateModalOpen: value });
  },
  isDelegateChangedView: false,
  setIsDelegateChangedView: (value) => {
    set({ isDelegateChangedView: value });
  },
});
