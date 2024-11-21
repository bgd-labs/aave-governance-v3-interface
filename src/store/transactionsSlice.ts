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
import { Address, Hex } from 'viem';

import { createPayload } from '../components/Create/actions/createPayload';
import { createProposal } from '../components/Create/actions/createProposal';
import { gelatoApiKeys } from '../configs/appConfig';
import { appConfig } from '../old/utils/appConfig';
import { PayloadAction, ProposalInitialStruct } from '../types';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';

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
  claimFees = 'claimFees',
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

// type DelegateTx = BaseTx & {
//   type: TxType.delegate;
//   payload: {
//     delegateData: DelegateItem[];
//     formDelegateData: DelegateData[];
//     timestamp: number;
//   };
// };

type TestTx = BaseTx & {
  type: TxType.test;
};

type CancelProposalTx = BaseTx & {
  type: TxType.cancelProposal;
  payload: {
    proposalId: number;
  };
};

// type RepresentationsTx = BaseTx & {
//   type: TxType.representations;
//   payload: {
//     initialData: RepresentationFormData[];
//     data: RepresentationFormData[];
//     timestamp: number;
//   };
// };

type ReturnFeesTx = BaseTx & {
  type: TxType.claimFees;
  payload: {
    creator: Address;
    proposalIds: number[];
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
  // | DelegateTx
  | TestTx
  | CancelProposalTx
  // | RepresentationsTx
  | ReturnFeesTx;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion> & {
  createPayload: ({
    chainId,
    payloadActions,
    payloadsController,
    payloadId,
  }: {
    chainId: number;
    payloadActions: PayloadAction[];
    payloadsController: Address;
    payloadId: number;
  }) => Promise<void>;
  createProposal: ({
    votingPortalAddress,
    ipfsHash,
    cancellationFee,
    proposalsCount,
    payloads,
  }: {
    votingPortalAddress: Address;
    ipfsHash: Hex;
    cancellationFee: string;
    proposalsCount: number;
  } & Pick<ProposalInitialStruct, 'payloads'>) => Promise<void>;

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
  IWalletSlice & IRpcSwitcherSlice
> = (set, get) => ({
  createPayload: async ({
    chainId,
    payloadActions,
    payloadsController,
    payloadId,
  }) => {
    await get().executeTx({
      body: () => {
        return createPayload({
          wagmiConfig: get().wagmiConfig,
          chainId,
          payloadActions,
          payloadsController,
        });
      },
      params: {
        type: TxType.createPayload,
        desiredChainID: chainId,
        payload: {
          chainId,
          payloadId,
          payloadsController,
        },
      },
    });
  },

  createProposal: async (input) => {
    await get().executeTx({
      body: () => {
        return createProposal({
          wagmiConfig: get().wagmiConfig,
          clients: selectAppClients(get()),
          ...input,
        });
      },
      params: {
        type: TxType.createProposal,
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId: input.proposalsCount,
        },
      },
    });
  },

  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: async () => {
      // const updateProposalData = async (proposalId: number) => {
      //   await get().getDetailedProposalsData({
      //     ids: [proposalId],
      //     fullData: true,
      //   });
      // };
      // switch (data.type) {
      //   case TxType.createPayload:
      //     await get().getDetailedPayloadsData(
      //       data.payload.chainId,
      //       data.payload.payloadsController as Hex,
      //       [data.payload.payloadId],
      //     );
      //     set({
      //       totalPayloadsCount: {
      //         ...get().totalPayloadsCount,
      //         [data.payload.payloadsController]: data.payload.payloadId + 1,
      //       },
      //     });
      //     break;
      //   case TxType.activateVoting:
      //     await updateProposalData(data.payload.proposalId);
      //     break;
      //   case TxType.sendProofs:
      //     await updateProposalData(data.payload.proposalId);
      //     break;
      //   case TxType.activateVotingOnVotingMachine:
      //     await updateProposalData(data.payload.proposalId);
      //     break;
      //   case TxType.vote: {
      //     const proposalData = getProposalDataById({
      //       detailedProposalsData: get().detailedProposalsData,
      //       configs: get().configs,
      //       contractsConstants: get().contractsConstants,
      //       representativeLoading: get().representativeLoading,
      //       activeWallet: get().activeWallet,
      //       representative: get().representative,
      //       blockHashBalanceLoadings: get().blockHashBalanceLoadings,
      //       blockHashBalance: get().blockHashBalance,
      //       proposalId: data.payload.proposalId,
      //     });
      //
      //     if (proposalData) {
      //       const startBlock =
      //         proposalData.proposal.data.votingMachineData.createdBlock;
      //
      //       await updateProposalData(data.payload.proposalId);
      //       await get().getVoters(
      //         data.payload.proposalId,
      //         proposalData.proposal.data.votingChainId,
      //         startBlock,
      //       );
      //     }
      //     break;
      //   }
      //   case TxType.closeAndSendVote:
      //     await updateProposalData(data.payload.proposalId);
      //     break;
      //   case TxType.executeProposal:
      //     await updateProposalData(data.payload.proposalId);
      //     break;
      //   case TxType.executePayload:
      //     if (data.payload.payloadController) {
      //       await get().getPayloadsExploreData(
      //         data.payload.chainId,
      //         data.payload.payloadController,
      //       );
      //     } else {
      //       await updateProposalData(data.payload.proposalId);
      //     }
      //     break;
      //   case TxType.delegate:
      //     await get().getDelegateData();
      //     get().setIsDelegateChangedView(false);
      //     break;
      //   case TxType.representations:
      //     await get().getRepresentationData();
      //     get().setIsRepresentationsChangedView(false);
      //     get().resetL1Balances();
      //     break;
      //   case TxType.cancelProposal:
      //     await updateProposalData(data.payload.proposalId);
      //     break;
      //   case TxType.claimFees:
      //     await get().updateCreationFeesDataByCreator(
      //       data.payload.creator,
      //       data.payload.proposalIds,
      //     );
      //     await get().getDetailedProposalsData({
      //       ids: data.payload.proposalIds,
      //       fullData: true,
      //     });
      //     break;
      // }
    },
    // for initial don't set default clients because of rpc switcher flow
    defaultClients: {},
  })(set, get),

  isGelatoAvailableChains: {},
  checkIsGelatoAvailableWithApiKey: async (chainId) => {
    if (typeof get().isGelatoAvailableChains[chainId] === 'undefined') {
      if (gelatoApiKeys[chainId]) {
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
