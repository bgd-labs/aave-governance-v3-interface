import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Address, zeroHash } from 'viem';

import { appConfig } from '../configs/appConfig';
import { getBlockNumberByTimestamp } from '../helpers/getBlockNumberByTimestamp';
import { texts } from '../helpers/texts/texts';
import {
  getPayloadsCreated,
  getPayloadsExecuted,
  getPayloadsQueued,
  getProposalActivated,
  getProposalActivatedOnVM,
  getProposalCreated,
  getProposalQueued,
  getProposalVotingClosed,
} from '../requests/utils/getProposalEventsRPC';
import {
  DetailedProposalData,
  FilteredEvent,
  HistoryItemType,
  InitialPayloadState,
  InitialProposalState,
  ProposalHistoryItem,
  ProposalState,
  TxInfo,
} from '../types';
import { IProposalsSlice } from './proposalsSlice';
import { IRpcSwitcherSlice } from './rpcSwitcherSlice';
import { selectAppClients } from './selectors/rpcSwitcherSelectors';
import { IWeb3Slice } from './web3Slice';

export interface IProposalHistorySlice {
  proposalHistory: Record<string, ProposalHistoryItem>;
  initProposalHistoryItem: ({
    historyId,
    type,
    title,
    txId,
    txChainId,
    timestamp,
    addresses,
  }: {
    historyId: string;
    type: HistoryItemType;
    title: string;
    txId: number;
    txChainId: number;
    timestamp?: number;
    addresses?: string[];
    txHash?: string;
  }) => void;
  initProposalHistory: (
    proposal: DetailedProposalData,
    proposalEvents?: Record<string, ProposalHistoryItem>,
  ) => void;
  setHistoryItemLoading: (historyId: string) => void;
  setHistoryItemHash: (
    historyId: string,
    filteredEvents: FilteredEvent[],
  ) => void;

  setPayloadsCreatedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void;

  setProposalCreatedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void;

  setProposalActivatedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void;

  setProposalActivatedOnVMHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void;

  setProposalVotingClosedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void;

  setProposalQueuedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void;

  setPayloadsQueuedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void;

  setPayloadsExecutedHistoryHash: (
    proposal: DetailedProposalData,
    txInfo: TxInfo,
  ) => void;
}

export const createProposalHistorySlice: StoreSlice<
  IProposalHistorySlice,
  IWeb3Slice & IRpcSwitcherSlice & IProposalsSlice
> = (set, get) => ({
  // initial
  proposalHistory: {},
  initProposalHistoryItem: ({
    historyId,
    type,
    title,
    txId,
    txChainId,
    timestamp,
    addresses,
    txHash,
  }) => {
    set((state) =>
      produce(state, (draft) => {
        const historyItem = draft.proposalHistory[historyId];

        draft.proposalHistory[historyId] = {
          type: type,
          title: title,
          timestamp: timestamp,
          addresses,
          txInfo: {
            id: txId,
            hash:
              typeof historyItem?.txInfo.hash !== 'undefined' &&
              historyItem?.txInfo.hash !== zeroHash
                ? historyItem?.txInfo.hash
                : txHash || zeroHash,
            chainId: txChainId,
            hashLoading: false,
          },
        };
      }),
    );
  },
  initProposalHistory: (proposal, proposalEvents) => {
    // PAYLOADS_CREATED
    proposal.payloadsData.forEach((payload, index) => {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.PAYLOADS_CREATED}_${Number(payload.id)}_${Number(payload.chain)}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PAYLOADS_CREATED,
        title: texts.proposalHistory.payloadCreated(
          index + 1,
          proposal.payloadsData.length,
        ),
        txId: Number(payload.id),
        txChainId: Number(payload.chain),
        timestamp: payload.data.createdAt,
        addresses: payload.data.actions.map((action: any) => action.target),
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    });

    // PROPOSAL_CREATED
    const historyIdProposalCreated = `${proposal.proposalData.id}_${HistoryItemType.CREATED}`;
    get().initProposalHistoryItem({
      historyId: historyIdProposalCreated,
      type: HistoryItemType.CREATED,
      title: texts.proposalHistory.proposalCreated(proposal.proposalData.id),
      txId: proposal.proposalData.id,
      txChainId: appConfig.govCoreChainId,
      timestamp: proposal.proposalData.creationTime,
      txHash:
        proposalEvents && proposalEvents[historyIdProposalCreated]
          ? proposalEvents[historyIdProposalCreated].txInfo.hash
          : undefined,
    });

    // PROPOSAL_ACTIVATE
    if (proposal.proposalData.snapshotBlockHash !== zeroHash) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.PROPOSAL_ACTIVATE}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_ACTIVATE,
        title: texts.proposalHistory.proposalActivated(
          proposal.proposalData.id,
        ),
        txId: proposal.proposalData.id,
        txChainId: appConfig.govCoreChainId,
        timestamp: proposal.proposalData.votingActivationTime,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // OPEN_TO_VOTE
    if (proposal.votingData.proposalData.creationBlockNumber > 0n) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.OPEN_TO_VOTE}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.OPEN_TO_VOTE,
        title: texts.proposalHistory.proposalOpenForVoting(
          proposal.proposalData.id,
        ),
        txId: proposal.proposalData.id,
        txChainId: proposal.votingData.votingChainId,
        timestamp: proposal.votingData.proposalData.startTime,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // VOTING_OVER
    if (proposal.formattedData.isVotingEnded) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.VOTING_OVER}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.VOTING_OVER,
        title: proposal.formattedData.isVotingFailed
          ? texts.proposalHistory.votingFailed
          : texts.proposalHistory.votingOver,
        txId: proposal.proposalData.id,
        txChainId: proposal.votingData.votingChainId,
        timestamp: proposal.votingData.proposalData.endTime,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // VOTING_CLOSED
    if (
      proposal.votingData.proposalData.votingClosedAndSentTimestamp > 0 &&
      !proposal.formattedData.isVotingFailed
    ) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.VOTING_CLOSED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.VOTING_CLOSED,
        title: texts.proposalHistory.proposalVotingClosed(
          proposal.proposalData.id,
        ),
        txId: proposal.proposalData.id,
        txChainId: proposal.votingData.votingChainId,
        timestamp:
          proposal.votingData.proposalData.votingClosedAndSentTimestamp,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // RESULTS_SENT
    if (
      proposal.votingData.proposalData.sentToGovernance &&
      !proposal.formattedData.isVotingFailed
    ) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.RESULTS_SENT}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.RESULTS_SENT,
        title: texts.proposalHistory.votingResultsSent,
        txId: proposal.proposalData.id,
        txChainId: appConfig.govCoreChainId,
        timestamp:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].timestamp
            : undefined,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // PROPOSAL_QUEUED
    if (
      proposal.proposalData.queuingTime > 0 &&
      !proposal.formattedData.isVotingFailed
    ) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.PROPOSAL_QUEUED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_QUEUED,
        title: texts.proposalHistory.proposalTimeLocked(
          proposal.proposalData.id,
        ),
        txId: proposal.proposalData.id,
        txChainId: appConfig.govCoreChainId,
        timestamp: proposal.proposalData.queuingTime,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // PROPOSAL_EXECUTED
    if (proposal.proposalData.state === InitialProposalState.Executed) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.PROPOSAL_EXECUTED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_EXECUTED,
        title: texts.proposalHistory.proposalExecuted(proposal.proposalData.id),
        txId: proposal.proposalData.id,
        txChainId: appConfig.govCoreChainId,
        timestamp:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].timestamp
            : undefined,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // PAYLOADS_QUEUED
    if (
      proposal.payloadsData.some(
        (payload) =>
          payload.data.queuedAt > 0 && !proposal.formattedData.isVotingFailed,
      )
    ) {
      proposal.payloadsData.forEach((payload, index) => {
        if (payload.data.queuedAt > 0) {
          const historyId = `${proposal.proposalData.id}_${HistoryItemType.PAYLOADS_QUEUED}_${Number(payload.id)}_${Number(payload.chain)}`;
          get().initProposalHistoryItem({
            historyId,
            type: HistoryItemType.PAYLOADS_QUEUED,
            title: texts.proposalHistory.payloadTimeLocked(
              index + 1,
              proposal.payloadsData.length,
            ),
            txId: Number(payload.id),
            txChainId: Number(payload.chain),
            timestamp: payload.data.queuedAt,
            txHash:
              proposalEvents && proposalEvents[historyId]
                ? proposalEvents[historyId].txInfo.hash
                : undefined,
          });
        }
      });
    }

    // PAYLOADS_EXECUTED
    if (
      proposal.payloadsData.some(
        (payload) =>
          payload.data.executedAt > 0 && !proposal.formattedData.isVotingFailed,
      )
    ) {
      proposal.payloadsData.forEach((payload, index) => {
        if (payload.data.executedAt > 0) {
          const historyId = `${proposal.proposalData.id}_${HistoryItemType.PAYLOADS_EXECUTED}_${Number(payload.id)}_${Number(payload.chain)}`;
          get().initProposalHistoryItem({
            historyId,
            type: HistoryItemType.PAYLOADS_EXECUTED,
            title: texts.proposalHistory.payloadExecuted(
              index + 1,
              proposal.payloadsData.length,
            ),
            txId: Number(payload.id),
            txChainId: Number(payload.chain),
            timestamp: payload.data.executedAt,
            txHash:
              proposalEvents && proposalEvents[historyId]
                ? proposalEvents[historyId].txInfo.hash
                : undefined,
          });
        }
      });
    }

    // PROPOSAL_CANCELED
    if (proposal.formattedData.state.state === ProposalState.Canceled) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.PROPOSAL_CANCELED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_CANCELED,
        title: texts.proposalHistory.proposalCanceled(proposal.proposalData.id),
        txId: proposal.proposalData.id,
        txChainId: appConfig.govCoreChainId,
        timestamp:
          proposal.formattedData.lastPayloadCanceledAt >
          proposal.proposalData.cancelTimestamp
            ? proposal.formattedData.lastPayloadCanceledAt
            : proposal.proposalData.cancelTimestamp,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // PAYLOADS_EXPIRED
    if (
      proposal.payloadsData.some(
        (payload) =>
          payload?.data.state === InitialPayloadState.Expired &&
          !proposal.formattedData.isVotingFailed,
      )
    ) {
      proposal.payloadsData.forEach((payload, index) => {
        if (payload.data.state === InitialPayloadState.Expired) {
          const historyId = `${proposal.proposalData.id}_${HistoryItemType.PAYLOADS_EXPIRED}_${Number(payload.id)}_${Number(payload.chain)}`;
          get().initProposalHistoryItem({
            historyId,
            type: HistoryItemType.PAYLOADS_EXPIRED,
            title: texts.proposalHistory.payloadExpired(
              index + 1,
              proposal.payloadsData.length,
            ),
            txId: Number(payload.id),
            txChainId: Number(payload.chain),
            timestamp:
              payload.data.queuedAt <= 0
                ? payload.data.createdAt + payload.data.expirationTime
                : payload.data.queuedAt +
                  payload.data.delay +
                  payload.data.gracePeriod,
            txHash:
              proposalEvents && proposalEvents[historyId]
                ? proposalEvents[historyId].txInfo.hash
                : undefined,
          });
        }
      });
    }

    // PROPOSAL_EXPIRED
    if (proposal.formattedData.state.state === ProposalState.Expired) {
      const historyId = `${proposal.proposalData.id}_${HistoryItemType.PROPOSAL_EXPIRED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_EXPIRED,
        title: texts.proposalHistory.proposalExpired(proposal.proposalData.id),
        txId: proposal.proposalData.id,
        txChainId: appConfig.govCoreChainId,
        timestamp:
          proposal.proposalData.state === InitialProposalState.Executed
            ? proposal.formattedData.lastPayloadExpiredAt
            : proposal.proposalData.creationTime +
              Number(get().configs?.contractsConstants.expirationTime ?? 0),
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }
  },
  setHistoryItemLoading: (historyId) => {
    set((state) =>
      produce(state, (draft) => {
        draft.proposalHistory[historyId] = {
          ...draft.proposalHistory[historyId],
          txInfo: {
            ...draft.proposalHistory[historyId].txInfo,
            hashLoading:
              draft.proposalHistory[historyId].txInfo.hash === zeroHash,
          },
        };
      }),
    );
  },
  setHistoryItemHash: (historyId, filteredEvents) => {
    const historyItem = get().proposalHistory[historyId];

    if (historyItem.txInfo.hash === zeroHash) {
      if (historyItem.timestamp) {
        filteredEvents.forEach((event) =>
          set((state) =>
            produce(state, (draft) => {
              draft.proposalHistory[historyId] = {
                ...draft.proposalHistory[historyId],
                txInfo: {
                  ...draft.proposalHistory[historyId].txInfo,
                  hash:
                    draft.proposalHistory[historyId].txInfo.hash !== zeroHash
                      ? draft.proposalHistory[historyId].txInfo.hash
                      : event.transactionHash,
                },
              };
            }),
          ),
        );

        get().setHistoryItemLoading(historyId);
      }
    }
  },

  // PAYLOADS_CREATED
  setPayloadsCreatedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposalData.id}_${HistoryItemType.PAYLOADS_CREATED}_${txInfo.id}_${txInfo.chainId}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    const payloadControllerAddress =
      proposal.payloadsData.find(
        (payload) =>
          Number(payload.id) === txInfo.id &&
          Number(payload.chain) === txInfo.chainId,
      )?.payloadsController || '';

    if (historyItem.txInfo.hash === zeroHash) {
      if (historyItem.timestamp) {
        try {
          const { minBlockNumber, maxBlockNumber } =
            await getBlockNumberByTimestamp({
              chainId: txInfo.chainId,
              targetTimestamp: historyItem.timestamp,
              client: get().appClients[txInfo.chainId].instance,
            });
          const events = await getPayloadsCreated({
            contractAddress: payloadControllerAddress as Address,
            client: selectAppClients(get())[txInfo.chainId],
            chainId: txInfo.chainId,
            startBlock: minBlockNumber,
            endBlock: maxBlockNumber,
          });

          const filteredEvents = events
            .filter(
              (payload) =>
                payload.payloadId === txInfo.id &&
                payload.chainId === txInfo.chainId &&
                payload.transactionHash !== txInfo.hash,
            )
            .map((event) => {
              return { transactionHash: event.transactionHash };
            });

          get().setHistoryItemHash(historyId, filteredEvents);
          get().setRpcError({
            isError: false,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        } catch {
          get().setRpcError({
            isError: true,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        }
      }
    }
  },

  // PROPOSAL_CREATED
  setProposalCreatedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposalData.id}_${HistoryItemType.CREATED}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === zeroHash) {
      if (historyItem.timestamp) {
        try {
          const { minBlockNumber, maxBlockNumber } =
            await getBlockNumberByTimestamp({
              chainId: txInfo.chainId,
              targetTimestamp: historyItem.timestamp,
              client: get().appClients[txInfo.chainId].instance,
            });
          const events = await getProposalCreated({
            contractAddress: appConfig.govCoreConfig.contractAddress,
            client: selectAppClients(get())[txInfo.chainId],
            startBlock: minBlockNumber,
            endBlock: maxBlockNumber,
          });

          const filteredEvents = events
            .filter(
              (proposal) =>
                proposal.proposalId === txInfo.id &&
                proposal.transactionHash !== txInfo.hash,
            )
            .map((event) => {
              return { transactionHash: event.transactionHash };
            });

          get().setHistoryItemHash(historyId, filteredEvents);
          get().setRpcError({
            isError: false,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        } catch {
          get().setRpcError({
            isError: true,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        }
      }
    }
  },

  // PROPOSAL_ACTIVATE
  setProposalActivatedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposalData.id}_${HistoryItemType.PROPOSAL_ACTIVATE}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === zeroHash) {
      if (historyItem.timestamp) {
        try {
          const { minBlockNumber, maxBlockNumber } =
            await getBlockNumberByTimestamp({
              chainId: txInfo.chainId,
              targetTimestamp: historyItem.timestamp,
              client: get().appClients[txInfo.chainId].instance,
            });
          const events = await getProposalActivated({
            contractAddress: appConfig.govCoreConfig.contractAddress,
            client: selectAppClients(get())[txInfo.chainId],
            startBlock: minBlockNumber,
            endBlock: maxBlockNumber,
          });

          const filteredEvents = events
            .filter(
              (proposal) =>
                proposal.proposalId === txInfo.id &&
                proposal.transactionHash !== txInfo.hash,
            )
            .map((event) => {
              return { transactionHash: event.transactionHash };
            });

          get().setHistoryItemHash(historyId, filteredEvents);
          get().setRpcError({
            isError: false,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        } catch {
          get().setRpcError({
            isError: true,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        }
      }
    }
  },

  // OPEN_TO_VOTE
  setProposalActivatedOnVMHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposalData.id}_${HistoryItemType.OPEN_TO_VOTE}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === zeroHash) {
      if (proposal.votingData.proposalData.creationBlockNumber > 0n) {
        try {
          const events = await getProposalActivatedOnVM({
            contractAddress: appConfig.votingMachineConfig[
              historyItem.txInfo.chainId
            ].contractAddress as Address,
            client: selectAppClients(get())[historyItem.txInfo.chainId],
            startBlock:
              Number(proposal.votingData.proposalData.creationBlockNumber) -
              100,
            endBlock:
              Number(proposal.votingData.proposalData.creationBlockNumber) +
              100,
          });

          const filteredEvents = events
            .filter(
              (proposal) =>
                proposal.proposalId === txInfo.id &&
                proposal.transactionHash !== txInfo.hash,
            )
            .map((event) => {
              return { transactionHash: event.transactionHash };
            });

          get().setHistoryItemHash(historyId, filteredEvents);
          get().setRpcError({
            isError: false,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        } catch {
          get().setRpcError({
            isError: true,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        }
      }
    }
  },

  // VOTING_CLOSED
  setProposalVotingClosedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposalData.id}_${HistoryItemType.VOTING_CLOSED}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === zeroHash) {
      if (proposal.votingData.proposalData.votingClosedAndSentBlockNumber > 0) {
        try {
          const events = await getProposalVotingClosed({
            contractAddress:
              appConfig.votingMachineConfig[historyItem.txInfo.chainId]
                .contractAddress,
            client: selectAppClients(get())[historyItem.txInfo.chainId],
            startBlock:
              Number(
                proposal.votingData.proposalData.votingClosedAndSentBlockNumber,
              ) - 100,
            endBlock:
              Number(
                proposal.votingData.proposalData.votingClosedAndSentBlockNumber,
              ) + 100,
          });

          const filteredEvents = events
            .filter(
              (proposal) =>
                proposal.proposalId === txInfo.id &&
                proposal.transactionHash !== txInfo.hash,
            )
            .map((event) => {
              return { transactionHash: event.transactionHash };
            });

          get().setHistoryItemHash(historyId, filteredEvents);
          get().setRpcError({
            isError: false,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        } catch {
          get().setRpcError({
            isError: true,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        }
      }
    }
  },

  // PROPOSAL_QUEUED
  setProposalQueuedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposalData.id}_${HistoryItemType.PROPOSAL_QUEUED}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === zeroHash) {
      if (historyItem.timestamp) {
        try {
          const { minBlockNumber, maxBlockNumber } =
            await getBlockNumberByTimestamp({
              chainId: txInfo.chainId,
              targetTimestamp: historyItem.timestamp,
              client: get().appClients[txInfo.chainId].instance,
            });
          const events = await getProposalQueued({
            contractAddress: appConfig.govCoreConfig.contractAddress,
            client: selectAppClients(get())[txInfo.chainId],
            startBlock: minBlockNumber,
            endBlock: maxBlockNumber,
          });

          const filteredEvents = events
            .filter(
              (proposal) =>
                proposal.proposalId === txInfo.id &&
                proposal.transactionHash !== txInfo.hash,
            )
            .map((event) => {
              return { transactionHash: event.transactionHash };
            });

          get().setHistoryItemHash(historyId, filteredEvents);
          get().setRpcError({
            isError: false,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        } catch {
          get().setRpcError({
            isError: true,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        }
      }
    }
  },

  // PAYLOADS_QUEUED
  setPayloadsQueuedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposalData.id}_${HistoryItemType.PAYLOADS_QUEUED}_${txInfo.id}_${txInfo.chainId}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    const payloadControllerAddress =
      proposal.payloadsData.find(
        (payload) =>
          Number(payload.id) === txInfo.id &&
          Number(payload.chain) === txInfo.chainId,
      )?.payloadsController || '';

    if (historyItem.txInfo.hash === zeroHash) {
      if (historyItem.timestamp) {
        try {
          const { minBlockNumber, maxBlockNumber } =
            await getBlockNumberByTimestamp({
              chainId: txInfo.chainId,
              targetTimestamp: historyItem.timestamp,
              client: get().appClients[txInfo.chainId].instance,
            });
          const events = await getPayloadsQueued({
            contractAddress: payloadControllerAddress as Address,
            startBlock: minBlockNumber,
            endBlock: maxBlockNumber,
            chainId: txInfo.chainId,
            client: selectAppClients(get())[txInfo.chainId],
          });

          const filteredEvents = events
            .filter(
              (payload) =>
                payload.payloadId === txInfo.id &&
                payload.chainId === txInfo.chainId &&
                payload.transactionHash !== txInfo.hash,
            )
            .map((event) => {
              return { transactionHash: event.transactionHash };
            });

          get().setHistoryItemHash(historyId, filteredEvents);
          get().setRpcError({
            isError: false,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        } catch {
          get().setRpcError({
            isError: true,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        }
      }
    }
  },

  // PAYLOADS_EXECUTED
  setPayloadsExecutedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposalData.id}_${HistoryItemType.PAYLOADS_EXECUTED}_${txInfo.id}_${txInfo.chainId}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    const payloadControllerAddress =
      proposal.payloadsData.find(
        (payload) =>
          Number(payload.id) === txInfo.id &&
          Number(payload.chain) === txInfo.chainId,
      )?.payloadsController || '';

    if (historyItem.txInfo.hash === zeroHash) {
      if (historyItem.timestamp) {
        try {
          const { minBlockNumber, maxBlockNumber } =
            await getBlockNumberByTimestamp({
              chainId: txInfo.chainId,
              targetTimestamp: historyItem.timestamp,
              client: get().appClients[txInfo.chainId].instance,
            });
          const events = await getPayloadsExecuted({
            contractAddress: payloadControllerAddress as Address,
            client: selectAppClients(get())[txInfo.chainId],
            startBlock: minBlockNumber,
            endBlock: maxBlockNumber,
            chainId: txInfo.chainId,
          });

          const filteredEvents = events
            .filter(
              (payload) =>
                payload.payloadId === txInfo.id &&
                payload.chainId === txInfo.chainId &&
                payload.transactionHash !== txInfo.hash,
            )
            .map((event) => {
              return { transactionHash: event.transactionHash };
            });

          get().setHistoryItemHash(historyId, filteredEvents);
          get().setRpcError({
            isError: false,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        } catch {
          get().setRpcError({
            isError: true,
            rpcUrl: get().appClients[txInfo.chainId].rpcUrl,
            chainId: txInfo.chainId,
          });
        }
      }
    }
  },
});
