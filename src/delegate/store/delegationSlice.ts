import {
  erc20Contract,
  normalizeBN,
} from '@bgd-labs/aave-governance-ui-helpers';
import { safeSdkOptions, StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { default as Sdk } from '@safe-global/safe-apps-sdk';
import { produce } from 'immer';
import isEqual from 'lodash/isEqual';
import { Hex, zeroAddress } from 'viem';

import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
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
          const erc20 = erc20Contract({
            client: get().appClients[appConfig.govCoreChainId].instance,
            contractAddress: underlyingAsset,
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
            votingToAddress: (votingToAddress === activeAddress ||
            votingToAddress === zeroAddress
              ? ''
              : !!votingToAddress
              ? votingToAddress
              : '') as Hex | '',
            propositionToAddress: (propositionToAddress === activeAddress ||
            propositionToAddress === zeroAddress
              ? ''
              : !!propositionToAddress
              ? propositionToAddress
              : '') as Hex | '',
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
        let votingToAddress = formDelegateItem.votingToAddress;
        let propositionToAddress = formDelegateItem.propositionToAddress;

        // convert ENS name to address
        if (votingToAddress && votingToAddress.length < 42) {
          votingToAddress =
            (await get().fetchAddressByEnsName(votingToAddress)) ||
            votingToAddress;
        }
        if (propositionToAddress && propositionToAddress.length < 42) {
          propositionToAddress =
            (await get().fetchAddressByEnsName(propositionToAddress)) ||
            propositionToAddress;
        }

        // get previous delegation data for current asset
        const delegateData: DelegateItem = get().delegateData.filter(
          (data) => data.underlyingAsset === underlyingAsset,
        )[0];

        const isAddressSame = votingToAddress === propositionToAddress;
        const isInitialAddressSame =
          delegateData.propositionToAddress === delegateData.votingToAddress;

        const isVotingToAddressSame =
          delegateData.votingToAddress === votingToAddress;
        const isPropositionToAddressSame =
          delegateData.propositionToAddress === propositionToAddress;

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
    const delegationService = get().delegationService;
    const activeAddress = get().activeWallet?.address;
    const isWalletAddressContract = get().activeWallet?.isContractAddress;
    const data = await get().prepareDataForDelegation(formDelegateData);

    if (activeAddress && !isWalletAddressContract) {
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
            return delegationService.batchMetaDelegate(sigs);
          },
          params: {
            type: 'delegate',
            desiredChainID: appConfig.govCoreChainId,
            payload: {
              delegateData: stateDelegateData,
              formDelegateData,
              timestamp,
            },
          },
        });
      }
    } else if (activeAddress && isWalletAddressContract) {
      if (get().activeWallet?.walletType === 'GnosisSafe') {
        const safeSdk = new Sdk(safeSdkOptions);

        const txsData = data.map((item) => {
          const txData = delegationService.getDelegateTxParams(
            item.underlyingAsset,
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
            type: 'delegate',
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
            type: 'delegate',
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
