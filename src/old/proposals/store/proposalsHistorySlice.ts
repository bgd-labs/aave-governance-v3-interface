import {
  checkHash,
  CombineProposalState,
  FilteredEvent,
  getBlockNumberByTimestamp,
  getProposalStepsAndAmounts,
  HistoryItemType,
  PayloadState,
  Proposal,
  ProposalHistoryItem,
  ProposalState,
  ProposalWithLoadings,
  TxInfo,
} from '@bgd-labs/aave-governance-ui-helpers';
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { Hex, zeroHash } from 'viem';

import { IRpcSwitcherSlice } from '../../rpcSwitcher/store/rpcSwitcherSlice';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { IWeb3Slice } from '../../web3/store/web3Slice';

export interface IProposalsHistorySlice {
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
    proposal: Proposal,
    proposalEvents?: Record<string, ProposalHistoryItem>,
  ) => void;
  setHistoryItemLoading: (historyId: string) => void;
  setHistoryItemHash: (
    historyId: string,
    filteredEvents: FilteredEvent[],
  ) => void;

  setPayloadsCreatedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void;

  setProposalCreatedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void;

  setProposalActivatedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void;

  setProposalActivatedOnVMHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void;

  setProposalVotingClosedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void;

  setProposalQueuedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void;

  setPayloadsQueuedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void;

  setPayloadsExecutedHistoryHash: (
    proposal: ProposalWithLoadings,
    txInfo: TxInfo,
  ) => void;
}

export const createProposalsHistorySlice: StoreSlice<
  IProposalsHistorySlice,
  IWeb3Slice & IRpcSwitcherSlice
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
    const {
      isVotingFailed,
      isVotingEnded,
      lastPayloadCanceledAt,
      lastPayloadExpiredAt,
    } = getProposalStepsAndAmounts({
      proposalData: proposal.data,
      quorum: proposal.config.quorum,
      differential: proposal.config.differential,
      precisionDivider: proposal.precisionDivider,
      cooldownPeriod: proposal.timings.cooldownPeriod,
      executionDelay: proposal.timings.executionDelay,
    });

    // PAYLOADS_CREATED
    proposal.data.payloads.forEach((payload, index) => {
      const historyId = `${proposal.data.id}_${HistoryItemType.PAYLOADS_CREATED}_${payload.id}_${payload.chainId}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PAYLOADS_CREATED,
        title: texts.proposalHistory.payloadCreated(
          index + 1,
          proposal.data.payloads.length,
        ),
        txId: payload.id,
        txChainId: payload.chainId,
        timestamp: payload.createdAt,
        addresses: payload.actions.map((action: any) => action.target),
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    });

    // PROPOSAL_CREATED
    const historyIdProposalCreated = `${proposal.data.id}_${HistoryItemType.CREATED}`;
    get().initProposalHistoryItem({
      historyId: historyIdProposalCreated,
      type: HistoryItemType.CREATED,
      title: texts.proposalHistory.proposalCreated(proposal.data.id),
      txId: proposal.data.id,
      txChainId: appConfig.govCoreChainId,
      timestamp: proposal.data.creationTime,
      txHash:
        proposalEvents && proposalEvents[historyIdProposalCreated]
          ? proposalEvents[historyIdProposalCreated].txInfo.hash
          : undefined,
    });

    // PROPOSAL_ACTIVATE
    if (checkHash(proposal.data.snapshotBlockHash).notZero) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_ACTIVATE}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_ACTIVATE,
        title: texts.proposalHistory.proposalActivated(proposal.data.id),
        txId: proposal.data.id,
        txChainId: appConfig.govCoreChainId,
        timestamp: proposal.data.votingActivationTime,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // OPEN_TO_VOTE
    if (proposal.data.votingMachineData.createdBlock > 0) {
      const historyId = `${proposal.data.id}_${HistoryItemType.OPEN_TO_VOTE}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.OPEN_TO_VOTE,
        title: texts.proposalHistory.proposalOpenForVoting(proposal.data.id),
        txId: proposal.data.id,
        txChainId: proposal.data.votingChainId,
        timestamp: proposal.data.votingMachineData.startTime,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // VOTING_OVER
    if (isVotingEnded) {
      const historyId = `${proposal.data.id}_${HistoryItemType.VOTING_OVER}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.VOTING_OVER,
        title: isVotingFailed
          ? texts.proposalHistory.votingFailed
          : texts.proposalHistory.votingOver,
        txId: proposal.data.id,
        txChainId: proposal.data.votingChainId,
        timestamp: proposal.data.votingMachineData.endTime,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // VOTING_CLOSED
    if (
      proposal.data.votingMachineData.votingClosedAndSentTimestamp > 0 &&
      !isVotingFailed
    ) {
      const historyId = `${proposal.data.id}_${HistoryItemType.VOTING_CLOSED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.VOTING_CLOSED,
        title: texts.proposalHistory.proposalVotingClosed(proposal.data.id),
        txId: proposal.data.id,
        txChainId: proposal.data.votingChainId,
        timestamp: proposal.data.votingMachineData.votingClosedAndSentTimestamp,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // RESULTS_SENT
    if (proposal.data.votingMachineData.sentToGovernance && !isVotingFailed) {
      const historyId = `${proposal.data.id}_${HistoryItemType.RESULTS_SENT}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.RESULTS_SENT,
        title: texts.proposalHistory.votingResultsSent,
        txId: proposal.data.id,
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
    if (proposal.data.queuingTime > 0 && !isVotingFailed) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_QUEUED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_QUEUED,
        title: texts.proposalHistory.proposalTimeLocked(proposal.data.id),
        txId: proposal.data.id,
        txChainId: appConfig.govCoreChainId,
        timestamp: proposal.data.queuingTime,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // PROPOSAL_EXECUTED
    if (proposal.data.state === ProposalState.Executed) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_EXECUTED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_EXECUTED,
        title: texts.proposalHistory.proposalExecuted(proposal.data.id),
        txId: proposal.data.id,
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
      proposal.data.payloads.some(
        (payload) => payload?.queuedAt > 0 && !isVotingFailed,
      )
    ) {
      proposal.data.payloads.forEach((payload, index) => {
        if (payload?.queuedAt > 0) {
          const historyId = `${proposal.data.id}_${HistoryItemType.PAYLOADS_QUEUED}_${payload.id}_${payload.chainId}`;
          get().initProposalHistoryItem({
            historyId,
            type: HistoryItemType.PAYLOADS_QUEUED,
            title: texts.proposalHistory.payloadTimeLocked(
              index + 1,
              proposal.data.payloads.length,
            ),
            txId: payload.id,
            txChainId: payload.chainId,
            timestamp: payload.queuedAt,
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
      proposal.data.payloads.some(
        (payload) => payload?.executedAt > 0 && !isVotingFailed,
      )
    ) {
      proposal.data.payloads.forEach((payload, index) => {
        if (payload?.executedAt > 0) {
          const historyId = `${proposal.data.id}_${HistoryItemType.PAYLOADS_EXECUTED}_${payload.id}_${payload.chainId}`;
          get().initProposalHistoryItem({
            historyId,
            type: HistoryItemType.PAYLOADS_EXECUTED,
            title: texts.proposalHistory.payloadExecuted(
              index + 1,
              proposal.data.payloads.length,
            ),
            txId: payload.id,
            txChainId: payload.chainId,
            timestamp: payload.executedAt,
            txHash:
              proposalEvents && proposalEvents[historyId]
                ? proposalEvents[historyId].txInfo.hash
                : undefined,
          });
        }
      });
    }

    // PROPOSAL_CANCELED
    if (proposal.combineState === CombineProposalState.Canceled) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_CANCELED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_CANCELED,
        title: texts.proposalHistory.proposalCanceled(proposal.data.id),
        txId: proposal.data.id,
        txChainId: appConfig.govCoreChainId,
        timestamp:
          lastPayloadCanceledAt > proposal.data.canceledAt
            ? lastPayloadCanceledAt
            : proposal.data.canceledAt,
        txHash:
          proposalEvents && proposalEvents[historyId]
            ? proposalEvents[historyId].txInfo.hash
            : undefined,
      });
    }

    // PAYLOADS_EXPIRED
    if (
      proposal.data.payloads.some(
        (payload) => payload?.state === PayloadState.Expired && !isVotingFailed,
      )
    ) {
      proposal.data.payloads.forEach((payload, index) => {
        if (payload.state === PayloadState.Expired) {
          const historyId = `${proposal.data.id}_${HistoryItemType.PAYLOADS_EXPIRED}_${payload.id}_${payload.chainId}`;
          get().initProposalHistoryItem({
            historyId,
            type: HistoryItemType.PAYLOADS_EXPIRED,
            title: texts.proposalHistory.payloadExpired(
              index + 1,
              proposal.data.payloads.length,
            ),
            txId: payload.id,
            txChainId: payload.chainId,
            timestamp:
              payload.queuedAt <= 0
                ? payload.createdAt + payload.expirationTime
                : payload.queuedAt + payload.delay + payload.gracePeriod,
            txHash:
              proposalEvents && proposalEvents[historyId]
                ? proposalEvents[historyId].txInfo.hash
                : undefined,
          });
        }
      });
    }

    // PROPOSAL_EXPIRED
    if (proposal.combineState === CombineProposalState.Expired) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_EXPIRED}`;
      get().initProposalHistoryItem({
        historyId,
        type: HistoryItemType.PROPOSAL_EXPIRED,
        title: texts.proposalHistory.proposalExpired(proposal.data.id),
        txId: proposal.data.id,
        txChainId: appConfig.govCoreChainId,
        timestamp:
          proposal.data.state === ProposalState.Executed
            ? lastPayloadExpiredAt
            : proposal.data.creationTime + proposal.timings.expirationTime,
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
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.PAYLOADS_CREATED}_${txInfo.id}_${txInfo.chainId}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    const payloadControllerAddress =
      proposal.proposal.data.payloads.find(
        (payload) =>
          payload.id === txInfo.id && payload.chainId === txInfo.chainId,
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
          const events = await get().govDataService.getPayloadsCreatedEvents(
            txInfo.chainId,
            payloadControllerAddress as Hex,
            minBlockNumber,
            maxBlockNumber,
          );

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
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.CREATED}`;
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
          const events = await get().govDataService.getProposalCreatedEvents(
            minBlockNumber,
            maxBlockNumber,
          );

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
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.PROPOSAL_ACTIVATE}`;
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
          const events = await get().govDataService.getProposalActivatedEvents(
            minBlockNumber,
            maxBlockNumber,
          );

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
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.OPEN_TO_VOTE}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === zeroHash) {
      if (proposal.proposal.data.votingMachineData.createdBlock > 0) {
        try {
          const events =
            await get().govDataService.getProposalActivatedOnVMEvents(
              historyItem.txInfo.chainId,
              proposal.proposal.data.votingMachineData.createdBlock - 100,
              proposal.proposal.data.votingMachineData.createdBlock + 100,
            );

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
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.VOTING_CLOSED}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === zeroHash) {
      if (
        proposal.proposal.data.votingMachineData
          .votingClosedAndSentBlockNumber > 0
      ) {
        try {
          const events = await get().govDataService.getProposalVotingClosed(
            historyItem.txInfo.chainId,
            proposal.proposal.data.votingMachineData
              .votingClosedAndSentBlockNumber - 100,
            proposal.proposal.data.votingMachineData
              .votingClosedAndSentBlockNumber + 100,
          );

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
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.PROPOSAL_QUEUED}`;
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
          const events = await get().govDataService.getProposalQueuedEvents(
            minBlockNumber,
            maxBlockNumber,
          );

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
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.PAYLOADS_QUEUED}_${txInfo.id}_${txInfo.chainId}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    const payloadControllerAddress =
      proposal.proposal.data.payloads.find(
        (payload) =>
          payload.id === txInfo.id && payload.chainId === txInfo.chainId,
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
          const events = await get().govDataService.getPayloadsQueuedEvents(
            txInfo.chainId,
            payloadControllerAddress as Hex,
            minBlockNumber,
            maxBlockNumber,
          );

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
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.PAYLOADS_EXECUTED}_${txInfo.id}_${txInfo.chainId}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    const payloadControllerAddress =
      proposal.proposal.data.payloads.find(
        (payload) =>
          payload.id === txInfo.id && payload.chainId === txInfo.chainId,
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
          const events = await get().govDataService.getPayloadsExecutedEvents(
            txInfo.chainId,
            payloadControllerAddress as Hex,
            minBlockNumber,
            maxBlockNumber,
          );

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
