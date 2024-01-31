// TODO: need check delegation

import { IERC20_ABI } from '@bgd-labs/aave-address-book';
import { normalizeBN } from '@bgd-labs/aave-governance-ui-helpers';
import {
  safeSdkOptions,
  StoreSlice,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';
import { default as Sdk } from '@safe-global/safe-apps-sdk';
import { produce } from 'immer';
import isEqual from 'lodash/isEqual';
import { getContract, zeroAddress } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import {
  TransactionsSlice,
  TxType,
} from '../../transactions/store/transactionsSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { appConfig } from '../../utils/appConfig';
import { getTokenName, Token } from '../../utils/getTokenName';
import {
  BatchMetaDelegateParams,
  DelegateDataParams,
  GovernancePowerTypeApp,
} from '../../web3/services/delegationService';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';
import { DelegateData, DelegateItem } from '../types';
import { getToAddress, selectDelegateToAddress } from './delegationSelectors';

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
}

export const createDelegationSlice: StoreSlice<
  IDelegationSlice,
  IWeb3Slice &
    TransactionsSlice &
    IProposalsSlice &
    IUISlice &
    IEnsSlice &
    IRpcSwitcherSlice
> = (set, get) => ({
  delegateData: [],
  delegateDataLoading: false,
  getDelegateData: async () => {
    const activeAddress = get().activeWallet?.address;

    if (activeAddress) {
      set({ delegateDataLoading: true });

      const votingStrategy =
        await get().govDataService.getVotingStrategyContract();
      const underlyingAssets = await votingStrategy.read.getVotingAssetList();

      const delegateData = await Promise.all(
        underlyingAssets.map(async (underlyingAsset) => {
          const erc20 = getContract({
            abi: IERC20_ABI,
            address: underlyingAsset,
            client: get().appClients[appConfig.govCoreChainId].instance,
          });
          const symbol = getTokenName(underlyingAsset) as Token;
          const balance = await erc20.read.balanceOf([activeAddress]);

          const delegatesAddresses = await get().delegationService.getDelegates(
            underlyingAsset,
            activeAddress,
          );

          const votingToAddress = delegatesAddresses[0];
          const propositionToAddress = delegatesAddresses[1];

          return {
            underlyingAsset,
            symbol,
            amount: normalizeBN(balance.toString(), 18).toNumber(),
            votingToAddress: getToAddress(activeAddress, votingToAddress),
            propositionToAddress: getToAddress(
              propositionToAddress,
              votingToAddress,
            ),
          };
        }),
      );

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

        const votingToAddress = await selectDelegateToAddress({
          store: get(),
          activeAddress,
          addressTo: formDelegateItem.votingToAddress,
        });
        const propositionToAddress = await selectDelegateToAddress({
          store: get(),
          activeAddress,
          addressTo: formDelegateItem.propositionToAddress,
        });

        // get previous delegation data for current asset
        const delegateData: DelegateItem = get().delegateData.filter(
          (data) => data.underlyingAsset === underlyingAsset,
        )[0];

        console.log('prev delegate data', delegateData);
        console.log('votingToAddress', votingToAddress);
        console.log('propositionToAddress', propositionToAddress);

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
            delegatee: votingToAddress,
            delegationType: GovernancePowerTypeApp.All,
          });
        } else {
          // if delegationTo are different addresses
          // check if need to re-delegate voting
          if (!isVotingToAddressSame) {
            data.push({
              underlyingAsset,
              delegator: activeAddress,
              delegatee: votingToAddress,
              delegationType: GovernancePowerTypeApp.VOTING,
            });
          }
          // check if need to re-delegate proposition
          if (!isPropositionToAddressSame) {
            data.push({
              underlyingAsset,
              delegator: activeAddress,
              delegatee: propositionToAddress,
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
    const delegationService = get().delegationService;
    const activeAddress = get().activeWallet?.address;
    const isWalletAddressContract = get().activeWallet?.isContractAddress;
    const data = await get().prepareDataForDelegation(formDelegateData);

    if (activeAddress && !isWalletAddressContract) {
      if (data.length === 1) {
        await get().executeTx({
          body: () => {
            get().setModalOpen(true);
            return delegationService.delegate(
              data[0].underlyingAsset,
              data[0].delegatee,
              data[0].delegationType,
            );
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
          const sig = (await delegationService.delegateMetaSig(
            item.underlyingAsset,
            item.delegatee,
            item.delegationType,
            item.delegator,
            item.increaseNonce,
          )) as BatchMetaDelegateParams;
          sigs.push(sig);
        }

        if (!!sigs.length) {
          await get().executeTx({
            body: () => {
              get().setModalOpen(true);
              return delegationService.batchMetaDelegate(
                sigs,
                get().activeWallet?.address || zeroAddress,
              );
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
          const txData = delegationService.getDelegateTxParams(
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
            get().setModalOpen(true);
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
              await delegationService.delegate(
                item.underlyingAsset,
                item.delegatee,
                item.delegationType,
              );
            }
          }
        }

        await get().executeTx({
          body: () => {
            get().setModalOpen(true);
            return delegationService.delegate(
              data[data.length - 1].underlyingAsset,
              data[data.length - 1].delegatee,
              data[data.length - 1].delegationType,
            );
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
});
