import {
  BaseTx as BT,
  createTransactionsSlice as createBaseTransactionsSlice,
  ITransactionsSlice,
  IWalletSlice,
  StoreSlice,
  TransactionStatus,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Hex } from 'viem';

import { IDelegationSlice } from '../../delegate/store/delegationSlice';
import { DelegateData, DelegateItem } from '../../delegate/types';
import { IPayloadsExplorerSlice } from '../../payloadsExplorer/store/payloadsExplorerSlice';
import { IProposalCreateOverviewSlice } from '../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { IProposalsHistorySlice } from '../../proposals/store/proposalsHistorySlice';
import { IProposalsListCacheSlice } from '../../proposals/store/proposalsListCacheSlice';
import { getProposalDataById } from '../../proposals/store/proposalsSelectors';
import { IProposalsSlice } from '../../proposals/store/proposalsSlice';
import {
  IRepresentationsSlice,
  RepresentationFormData,
} from '../../representations/store/representationsSlice';
import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { IUISlice } from '../../ui/store/uiSlice';
import { gelatoApiKeys } from '../../utils/appConfig';
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';

export enum TxType {
  createPayload = 'createPayload',
  createProposal = 'createProposal',
  activateVoting = 'activateVoting',
  sendProofs = 'sendProofs',
  activateVotingOnVotingMachine = 'activateVotingOnVotingMachine',
  vote = 'vote',
  closeAndSendVote = 'closeAndSendVote',
  executeProposal = 'executeProposal',
  executePayload = 'executePayload',
  delegate = 'delegate',
  test = 'test',
  cancelProposal = 'cancelProposal',
  representations = 'representations',
}

type BaseTx = BT & {
  status?: TransactionStatus;
  pending: boolean;
  walletType: WalletType;
};

type CreatePayloadTx = BaseTx & {
  type: TxType.createPayload;
  payload: {
    chainId: number;
    payloadId: number;
    payloadsController: string;
  };
};

type CreateProposalTx = BaseTx & {
  type: TxType.createProposal;
  payload: {
    proposalId: number;
  };
};

type ActivateVotingTx = BaseTx & {
  type: TxType.activateVoting;
  payload: {
    proposalId: number;
  };
};

type SendProofsTx = BaseTx & {
  type: TxType.sendProofs;
  payload: {
    proposalId: number;
    blockHash: string;
    underlyingAsset: string;
    withSlot: boolean;
  };
};

type ActivateVotingOnVotingMachineTx = BaseTx & {
  type: TxType.activateVotingOnVotingMachine;
  payload: {
    proposalId: number;
  };
};

type VotingTx = BaseTx & {
  type: TxType.vote;
  payload: {
    proposalId: number;
    support: boolean;
    voter: string;
  };
};

type CloseAndSendVoteTx = BaseTx & {
  type: TxType.closeAndSendVote;
  payload: {
    proposalId: number;
  };
};

type ExecuteProposalTx = BaseTx & {
  type: TxType.executeProposal;
  payload: {
    proposalId: number;
  };
};

type ExecutePayloadTx = BaseTx & {
  type: TxType.executePayload;
  payload: {
    proposalId: number;
    payloadId: number;
    chainId: number;
    payloadController?: Hex;
  };
};

type DelegateTx = BaseTx & {
  type: TxType.delegate;
  payload: {
    delegateData: DelegateItem[];
    formDelegateData: DelegateData[];
    timestamp: number;
  };
};

type TestTx = BaseTx & {
  type: TxType.test;
};

type CancelProposalTx = BaseTx & {
  type: TxType.cancelProposal;
  payload: {
    proposalId: number;
  };
};

type RepresentationsTx = BaseTx & {
  type: TxType.representations;
  payload: {
    initialData: RepresentationFormData[];
    data: RepresentationFormData[];
    timestamp: number;
  };
};

export type TransactionUnion =
  | CreatePayloadTx
  | CreateProposalTx
  | ActivateVotingTx
  | SendProofsTx
  | ActivateVotingOnVotingMachineTx
  | VotingTx
  | CloseAndSendVoteTx
  | ExecuteProposalTx
  | ExecutePayloadTx
  | DelegateTx
  | TestTx
  | CancelProposalTx
  | RepresentationsTx;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion> & {
  isGelatoAvailableChains: Record<number, boolean>;
  checkIsGelatoAvailableWithApiKey: (chainId: number) => Promise<void>;
};

export type TxWithStatus = TransactionUnion & {
  status?: TransactionStatus;
  pending: boolean;
  replacedTxHash?: Hex;
};

export type AllTransactions = TxWithStatus[];

export const createTransactionsSlice: StoreSlice<
  TransactionsSlice,
  IProposalsListCacheSlice &
    IWeb3Slice &
    IProposalsSlice &
    IWalletSlice &
    IDelegationSlice &
    IUISlice &
    IProposalsHistorySlice &
    IRepresentationsSlice &
    IEnsSlice &
    IRpcSwitcherSlice &
    IProposalCreateOverviewSlice &
    IPayloadsExplorerSlice
> = (set, get) => ({
  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: async (data) => {
      const updateProposalData = async (proposalId: number) => {
        await get().getDetailedProposalsData({
          ids: [proposalId],
          fullData: true,
        });
      };

      switch (data.type) {
        case TxType.createPayload:
          await get().getDetailedPayloadsData(
            data.payload.chainId,
            data.payload.payloadsController as Hex,
            [data.payload.payloadId],
          );
          set({
            totalPayloadsCount: {
              ...get().totalPayloadsCount,
              [data.payload.payloadsController]: data.payload.payloadId + 1,
            },
          });
          break;
        case TxType.activateVoting:
          await updateProposalData(data.payload.proposalId);
          break;
        case TxType.sendProofs:
          await updateProposalData(data.payload.proposalId);
          break;
        case TxType.activateVotingOnVotingMachine:
          await updateProposalData(data.payload.proposalId);
          break;
        case TxType.vote:
          const proposalData = getProposalDataById(
            get(),
            data.payload.proposalId,
          );
          if (proposalData) {
            const startBlock =
              proposalData.proposal.data.votingMachineData.createdBlock;

            await updateProposalData(data.payload.proposalId);
            await get().getVoters(
              data.payload.proposalId,
              proposalData.proposal.data.votingChainId,
              startBlock,
            );
          }
          break;
        case TxType.closeAndSendVote:
          await updateProposalData(data.payload.proposalId);
          break;
        case TxType.executeProposal:
          await updateProposalData(data.payload.proposalId);
          break;
        case TxType.executePayload:
          if (data.payload.payloadController) {
            await get().getPayloadsExploreData(
              data.payload.chainId,
              data.payload.payloadController,
            );
          } else {
            await updateProposalData(data.payload.proposalId);
          }
          break;
        case TxType.delegate:
          await get().getDelegateData();
          get().setIsDelegateChangedView(false);
          break;
        case TxType.representations:
          await get().getRepresentationData();
          get().setIsRepresentationsChangedView(false);
          get().resetL1Balances();
          break;
        case TxType.cancelProposal:
          await updateProposalData(data.payload.proposalId);
          break;
      }
    },
    // for initial don't set default clients because of rpc switcher flow
    defaultClients: {},
  })(set, get),

  isGelatoAvailableChains: {},
  checkIsGelatoAvailableWithApiKey: async (chainId) => {
    if (typeof get().isGelatoAvailableChains[chainId] === 'undefined') {
      if (!!gelatoApiKeys[chainId]) {
        await get().checkIsGelatoAvailable(chainId);
        set((state) =>
          produce(state, (draft) => {
            draft.isGelatoAvailableChains[chainId] = get().isGelatoAvailable;
          }),
        );
      } else {
        set((state) =>
          produce(state, (draft) => {
            draft.isGelatoAvailableChains[chainId] = false;
          }),
        );
      }
    }
  },
});
