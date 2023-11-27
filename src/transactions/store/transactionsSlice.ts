import {
  BaseTx as BT,
  createTransactionsSlice as createBaseTransactionsSlice,
  ITransactionsSlice,
  IWalletSlice,
  StoreSlice,
  TransactionStatus,
  WalletType,
} from '@bgd-labs/frontend-web3-utils';
import { Hex } from 'viem';

import { ICreateByParamsSlice } from '../../createByParams/store/createByParamsSlice';
import { IDelegationSlice } from '../../delegate/store/delegationSlice';
import { DelegateData, DelegateItem } from '../../delegate/types';
import { IPayloadsExplorerSlice } from '../../payloadsExplorer/store/payloadsExplorerSlice';
import { IProposalCreateOverviewV2Slice } from '../../proposalCreateOverviewV2/store/proposalCreateOverviewV2Slice';
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
import { IEnsSlice } from '../../web3/store/ensSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';

type BaseTx = BT & {
  status?: TransactionStatus;
  pending: boolean;
  walletType: WalletType;
};

type CreatePayloadTx = BaseTx & {
  type: 'createPayload';
  payload: {
    chainId: number;
    payloadId: number;
    payloadsController: string;
  };
};

type CreateProposalTx = BaseTx & {
  type: 'createProposal';
  payload: {
    proposalId: number;
  };
};

type ActivateVotingTx = BaseTx & {
  type: 'activateVoting';
  payload: {
    proposalId: number;
  };
};

type SendProofsTx = BaseTx & {
  type: 'sendProofs';
  payload: {
    proposalId: number;
    blockHash: string;
    underlyingAsset: string;
    withSlot: boolean;
  };
};

type ActivateVotingOnVotingMachineTx = BaseTx & {
  type: 'activateVotingOnVotingMachine';
  payload: {
    proposalId: number;
  };
};

type VotingTx = BaseTx & {
  type: 'vote';
  payload: {
    proposalId: number;
    support: boolean;
    voter: string;
  };
};

type CloseAndSendVoteTx = BaseTx & {
  type: 'closeAndSendVote';
  payload: {
    proposalId: number;
  };
};

type ExecuteProposalTx = BaseTx & {
  type: 'executeProposal';
  payload: {
    proposalId: number;
  };
};

type ExecutePayloadTx = BaseTx & {
  type: 'executePayload';
  payload: {
    proposalId: number;
    payloadId: number;
    chainId: number;
  };
};

type DelegateTx = BaseTx & {
  type: 'delegate';
  payload: {
    delegateData: DelegateItem[];
    formDelegateData: DelegateData[];
    timestamp: number;
  };
};

type TestTx = BaseTx & {
  type: 'test';
};

type CancelProposalTx = BaseTx & {
  type: 'cancelProposal';
  payload: {
    proposalId: number;
  };
};

type RepresentationsTx = BaseTx & {
  type: 'representations';
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

export type TransactionsSlice = ITransactionsSlice<TransactionUnion>;

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
    ICreateByParamsSlice &
    IPayloadsExplorerSlice &
    IProposalCreateOverviewV2Slice
> = (set, get) => ({
  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: async (data) => {
      const updateProposalData = async (proposalId: number) => {
        get().getDetailedProposalsData([proposalId]);
      };

      switch (data.type) {
        case 'createPayload':
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
        case 'activateVoting':
          await updateProposalData(data.payload.proposalId);
          break;
        case 'sendProofs':
          await updateProposalData(data.payload.proposalId);
          break;
        case 'activateVotingOnVotingMachine':
          await updateProposalData(data.payload.proposalId);
          break;
        case 'vote':
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
        case 'closeAndSendVote':
          await updateProposalData(data.payload.proposalId);
          break;
        case 'executeProposal':
          await updateProposalData(data.payload.proposalId);
          break;
        case 'executePayload':
          await updateProposalData(data.payload.proposalId);
          break;
        case 'delegate':
          await get().getDelegateData();
          get().setIsDelegateChangedView(false);
          break;
        case 'representations':
          await get().getRepresentationData();
          get().setIsRepresentationsChangedView(false);
          get().resetL1Balances();
          break;
        case 'cancelProposal':
          await updateProposalData(data.payload.proposalId);
          break;
      }
    },
    // for initial don't set default clients because of rpc switcher flow
    defaultClients: {},
  })(set, get),
});
