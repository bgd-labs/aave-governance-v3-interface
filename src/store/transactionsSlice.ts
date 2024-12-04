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
import { Address, Hex, zeroHash } from 'viem';
import { getBlock } from 'viem/actions';

import { appConfig, gelatoApiKeys } from '../configs/appConfig';
import {
  formatBalances,
  getVotingAssetsWithSlot,
} from '../helpers/getVoteBalanceSlot';
import {
  getProofOfRepresentative,
  getVotingProofs,
} from '../helpers/proofsHelpers';
import { activateVoting } from '../transactions/actions/activateVoting';
import { activateVotingOnVotingMachine } from '../transactions/actions/activateVotingOnVotingMachine';
import { cancelProposal } from '../transactions/actions/cancelProposal';
import { closeAndSendVote } from '../transactions/actions/closeAndSendVote';
import { createPayload } from '../transactions/actions/createPayload';
import { createProposal } from '../transactions/actions/createProposal';
import { executePayload } from '../transactions/actions/executePayload';
import { executeProposal } from '../transactions/actions/executeProposal';
import { redeemCancellationFee } from '../transactions/actions/redeemCancellationFee';
import { sendProofs } from '../transactions/actions/sendProofs';
import { vote } from '../transactions/actions/vote';
import { voteBySignature } from '../transactions/actions/voteBySignature';
import {
  DelegateData,
  DelegateItem,
  InitialPayload,
  PayloadAction,
  ProposalInitialStruct,
  RepresentationFormData,
  VotingDataByUser,
} from '../types';
import { IProposalSlice } from './proposalSlice';
import { IRepresentationsSlice } from './representationsSlice';
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

type ReturnFeesTx = BaseTx & {
  type: TxType.claimFees;
  payload: {
    creator: Address;
    proposalsIds: number[];
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
  | RepresentationsTx
  | ReturnFeesTx;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion> & {
  vote: ({
    votingChainId,
    proposalId,
    snapshotBlockHash,
    support,
    balances,
    gelato,
    voterAddress,
  }: {
    votingChainId: number;
    proposalId: number;
    snapshotBlockHash: string;
    support: boolean;
    balances: VotingDataByUser[];
    gelato?: boolean;
    voterAddress?: string;
  }) => Promise<void>;
  redeemCancellationFee: ({
    proposalsIds,
    creator,
  }: {
    proposalsIds: number[];
  } & Pick<ProposalInitialStruct, 'creator'>) => Promise<void>;

  activateVoting: (proposalId: number) => Promise<void>;
  sendProofs: ({
    votingChainId,
    proposalId,
    snapshotBlockHash,
    asset,
    baseBalanceSlotRaw,
    withSlot,
  }: {
    votingChainId: number;
    proposalId: number;
    snapshotBlockHash: string;
    asset: string;
    baseBalanceSlotRaw: number;
    withSlot?: boolean;
  }) => Promise<void>;
  activateVotingOnVotingMachine: (
    votingChainId: number,
    proposalId: number,
  ) => Promise<void>;
  closeAndSendVote: (
    votingChainId: number,
    proposalId: number,
  ) => Promise<void>;
  executeProposal: (proposalId: number) => Promise<void>;
  executePayload: ({
    proposalId,
    payload,
    withController,
  }: {
    proposalId: number;
    payload: InitialPayload;
    withController?: boolean;
  }) => Promise<void>;

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
  cancelProposal: (proposalId: number) => Promise<void>;

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
  IWalletSlice & IRpcSwitcherSlice & IProposalSlice & IRepresentationsSlice
> = (set, get) => ({
  vote: async ({
    votingChainId,
    proposalId,
    snapshotBlockHash,
    support,
    gelato,
    balances,
    voterAddress,
  }) => {
    const activeAddress = get().activeWallet?.address;
    const govCoreClient = get().appClients[appConfig.govCoreChainId].instance;

    if (activeAddress) {
      if (balances && balances.length > 0) {
        const formattedBalances = formatBalances(balances);

        if (voterAddress) {
          const proofs = await getVotingProofs({
            client: govCoreClient,
            blockHash: snapshotBlockHash as Hex,
            balances: formattedBalances,
            address: voterAddress as Address,
          });

          if (proofs && proofs.length > 0) {
            const proofOfRepresentative = await getProofOfRepresentative({
              client: govCoreClient,
              blockHash: snapshotBlockHash as Hex,
              address: voterAddress as Address,
              chainId: votingChainId,
            });

            await get().executeTx({
              body: () => {
                return gelato
                  ? voteBySignature({
                      votingChainId,
                      proposalId,
                      support,
                      votingAssetsWithSlot: getVotingAssetsWithSlot({
                        balances: formattedBalances,
                      }),
                      proofs,
                      signerAddress: activeAddress,
                      voterAddress: voterAddress as Address,
                      proofOfRepresentation: proofOfRepresentative,
                    })
                  : vote({
                      votingChainId,
                      proposalId,
                      support,
                      proofs,
                      voterAddress: voterAddress as Address,
                      proofOfRepresentation: proofOfRepresentative,
                    });
              },
              params: {
                type: TxType.vote,
                desiredChainID: votingChainId,
                payload: {
                  proposalId,
                  support,
                  voter: voterAddress,
                },
              },
            });
          }
        } else {
          const proofs = await getVotingProofs({
            client: govCoreClient,
            blockHash: snapshotBlockHash as Hex,
            balances: formattedBalances,
            address: activeAddress,
          });

          if (proofs && proofs.length > 0) {
            await get().executeTx({
              body: () => {
                return gelato
                  ? voteBySignature({
                      votingChainId,
                      proposalId,
                      support,
                      votingAssetsWithSlot: getVotingAssetsWithSlot({
                        balances: formattedBalances,
                      }),
                      signerAddress: activeAddress,
                      proofs,
                    })
                  : vote({
                      votingChainId,
                      proposalId,
                      support,
                      proofs,
                    });
              },
              params: {
                type: TxType.vote,
                desiredChainID: votingChainId,
                payload: {
                  proposalId,
                  support,
                  voter: activeAddress,
                },
              },
            });
          }
        }
      }
    }
  },

  redeemCancellationFee: async ({ creator, proposalsIds }) => {
    await get().checkAndSwitchNetwork(appConfig.govCoreChainId);
    const activeAddress = get().activeWallet?.address;
    if (activeAddress) {
      await get().executeTx({
        body: () => {
          return redeemCancellationFee({
            wagmiConfig: get().wagmiConfig,
            proposalsIds,
          });
        },
        params: {
          type: TxType.claimFees,
          desiredChainID: appConfig.govCoreChainId,
          payload: { creator, proposalsIds },
        },
      });
    }
  },

  activateVoting: async (proposalId) => {
    await get().executeTx({
      body: () => {
        return activateVoting({ wagmiConfig: get().wagmiConfig, proposalId });
      },
      params: {
        type: TxType.activateVoting,
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  sendProofs: async ({
    votingChainId,
    proposalId,
    snapshotBlockHash,
    asset,
    baseBalanceSlotRaw,
    withSlot,
  }) => {
    const activeAddress = get().activeWallet?.address;
    if (activeAddress) {
      if (snapshotBlockHash !== zeroHash) {
        const client = get().appClients[appConfig.govCoreChainId].instance;
        const block = await getBlock(client, {
          blockHash: snapshotBlockHash as Hex,
        });
        await get().executeTx({
          body: () => {
            return sendProofs({
              govCoreClient: selectAppClients(get())[appConfig.govCoreChainId],
              wagmiConfig: get().wagmiConfig,
              user: activeAddress,
              blockNumber: Number(block.number),
              asset,
              chainId: votingChainId,
              baseBalanceSlotRaw,
              withSlot,
            });
          },
          params: {
            type: TxType.sendProofs,
            desiredChainID: votingChainId,
            payload: {
              proposalId,
              blockHash: snapshotBlockHash,
              underlyingAsset: asset,
              withSlot,
            },
          },
        });
      }
    }
  },

  activateVotingOnVotingMachine: async (votingChainId, proposalId) => {
    await get().executeTx({
      body: () => {
        return activateVotingOnVotingMachine({
          wagmiConfig: get().wagmiConfig,
          votingChainId,
          proposalId,
        });
      },
      params: {
        type: TxType.activateVotingOnVotingMachine,
        desiredChainID: votingChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  closeAndSendVote: async (votingChainId, proposalId) => {
    await get().executeTx({
      body: () => {
        return closeAndSendVote({
          wagmiConfig: get().wagmiConfig,
          votingChainId,
          proposalId,
        });
      },
      params: {
        type: TxType.closeAndSendVote,
        desiredChainID: votingChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  executeProposal: async (proposalId) => {
    await get().executeTx({
      body: () => {
        return executeProposal({ wagmiConfig: get().wagmiConfig, proposalId });
      },
      params: {
        type: TxType.executeProposal,
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
        },
      },
    });
  },

  executePayload: async ({ proposalId, payload, withController }) => {
    await get().executeTx({
      body: () => {
        return executePayload({
          wagmiConfig: get().wagmiConfig,
          chainId: payload.chainId,
          payloadId: payload.id,
          payloadsController: payload.payloadsController,
        });
      },
      params: {
        type: TxType.executePayload,
        desiredChainID: payload.chainId,
        payload: {
          proposalId,
          payloadId: payload.id,
          chainId: payload.chainId,
          payloadController: withController
            ? payload.payloadsController
            : undefined,
        },
      },
    });
  },

  cancelProposal: async (proposalId) => {
    await get().executeTx({
      body: () => {
        return cancelProposal({ wagmiConfig: get().wagmiConfig, proposalId });
      },
      params: {
        type: TxType.cancelProposal,
        desiredChainID: appConfig.govCoreChainId,
        payload: {
          proposalId,
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

  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: async (data) => {
      switch (data.type) {
        case TxType.activateVoting:
          await get().getProposalDetails(data.payload.proposalId);
          break;
        case TxType.sendProofs:
          await get().getProposalDetails(data.payload.proposalId);
          break;
        case TxType.activateVotingOnVotingMachine:
          await get().getProposalDetails(data.payload.proposalId);
          break;
        // case TxType.vote: {
        //   const proposalData = getProposalDataById({
        //     detailedProposalsData: get().detailedProposalsData,
        //     configs: get().configs,
        //     contractsConstants: get().contractsConstants,
        //     representativeLoading: get().representativeLoading,
        //     activeWallet: get().activeWallet,
        //     representative: get().representative,
        //     blockHashBalanceLoadings: get().blockHashBalanceLoadings,
        //     blockHashBalance: get().blockHashBalance,
        //     proposalId: data.payload.proposalId,
        //   });
        //
        //   if (proposalData) {
        //     const startBlock =
        //       proposalData.proposal.data.votingMachineData.createdBlock;
        //
        //     await updateProposalData(data.payload.proposalId);
        //     await get().getVoters(
        //       data.payload.proposalId,
        //       proposalData.proposal.data.votingChainId,
        //       startBlock,
        //     );
        //   }
        //   break;
        // }
        case TxType.closeAndSendVote:
          await get().getProposalDetails(data.payload.proposalId);
          break;
        case TxType.executeProposal:
          await get().getProposalDetails(data.payload.proposalId);
          break;
        case TxType.executePayload:
          await get().getProposalDetails(data.payload.proposalId);
          break;
        case TxType.delegate:
          // await get().getDelegateData();
          // get().setIsDelegateChangedView(false);
          break;
        case TxType.representations:
          await get().getRepresentationData();
          get().setIsRepresentationsChangedView(false);
          break;
        case TxType.cancelProposal:
          await get().getProposalDetails(data.payload.proposalId);
          break;
        case TxType.claimFees:
          // await get().updateCreationFeesDataByCreator(
          //   data.payload.creator,
          //   data.payload.proposalIds,
          // );
          break;
      }
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
