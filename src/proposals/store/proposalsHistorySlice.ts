import { ethers } from 'ethers';
import { produce } from 'immer';

import {
  BasicProposalState,
  checkHash,
  getBlockNumberByTimestamp,
  getProposalStepsAndAmounts,
  PayloadState,
  Proposal,
  ProposalState,
  ProposalWithLoadings,
} from '../../../lib/helpers/src';
import { StoreSlice } from '../../../lib/web3/src';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { IWeb3Slice } from '../../web3/store/web3Slice';

export enum HistoryItemType {
  PAYLOADS_CREATED,
  CREATED,
  PROPOSAL_ACTIVATE,
  OPEN_TO_VOTE,
  VOTING_OVER,
  VOTING_CLOSED,
  RESULTS_SENT,
  PROPOSAL_QUEUED,
  PROPOSAL_EXECUTED,
  PAYLOADS_QUEUED,
  PAYLOADS_EXECUTED,
  PROPOSAL_CANCELED,
  PAYLOADS_EXPIRED,
  PROPOSAL_EXPIRED,
}

type FilteredEvent = {
  transactionHash: string;
};

export type TxInfo = {
  id: number;
  hash: string;
  chainId: number;
  hashLoading: boolean;
};

export type ProposalHistoryItem = {
  type: HistoryItemType;
  title: string;
  txInfo: TxInfo;
  timestamp?: number;
  addresses?: string[];
};

export interface IProposalsHistorySlice {
  proposalHistory: Record<string, ProposalHistoryItem>;
  initProposalHistoryItem: (
    historyId: string,
    type: HistoryItemType,
    title: string,
    txId: number,
    txChainId: number,
    timestamp?: number,
    addresses?: string[],
  ) => void;
  initProposalHistory: (proposal: Proposal) => void;
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
  IWeb3Slice
> = (set, get) => ({
  // initial
  proposalHistory: {},
  initProposalHistoryItem: (
    historyId,
    type,
    title,
    txId,
    txChainId,
    timestamp,
    addresses,
  ) => {
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
              historyItem?.txInfo.hash !== ethers.constants.HashZero
                ? historyItem?.txInfo.hash
                : ethers.constants.HashZero,
            chainId: txChainId,
            hashLoading: false,
          },
        };
      }),
    );
  },
  initProposalHistory: (proposal) => {
    const {
      isVotingFailed,
      isVotingEnded,
      lastPayloadCanceledAt,
      lastPayloadExpiredAt,
      forVotes,
      againstVotes,
    } = getProposalStepsAndAmounts({
      proposalData: proposal.data,
      quorum: proposal.config.quorum,
      differential: proposal.config.differential,
      precisionDivider: proposal.precisionDivider,
      cooldownPeriod: proposal.timings.cooldownPeriod,
      executionPayloadTime: proposal.timings.executionPayloadTime,
    });

    // PAYLOADS_CREATED
    proposal.data.payloads.forEach((payload, index) => {
      const historyId = `${proposal.data.id}_${HistoryItemType.PAYLOADS_CREATED}_${payload.id}_${payload.chainId}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.PAYLOADS_CREATED,
        texts.proposalHistory.payloadCreated(
          index + 1,
          proposal.data.payloads.length,
          payload.chainId,
        ),
        payload.id,
        payload.chainId,
        payload.createdAt,
        payload.actionAddresses,
      );
    });

    // PROPOSAL_CREATED
    const historyIdProposalCreated = `${proposal.data.id}_${HistoryItemType.CREATED}`;
    get().initProposalHistoryItem(
      historyIdProposalCreated,
      HistoryItemType.CREATED,
      texts.proposalHistory.proposalCreated(proposal.data.id),
      proposal.data.id,
      appConfig.govCoreChainId,
      proposal.data.creationTime,
    );

    // PROPOSAL_ACTIVATE
    if (checkHash(proposal.data.snapshotBlockHash).notZero) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_ACTIVATE}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.PROPOSAL_ACTIVATE,
        texts.proposalHistory.proposalActivated(proposal.data.id),
        proposal.data.id,
        appConfig.govCoreChainId,
        proposal.data.votingActivationTime,
      );
    }

    // OPEN_TO_VOTE
    if (proposal.data.votingMachineData.createdBlock > 0) {
      const historyId = `${proposal.data.id}_${HistoryItemType.OPEN_TO_VOTE}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.OPEN_TO_VOTE,
        texts.proposalHistory.proposalOpenForVoting(
          proposal.data.id,
          proposal.data.votingChainId,
        ),
        proposal.data.id,
        proposal.data.votingChainId,
        proposal.data.votingMachineData.startTime,
      );
    }

    // VOTING_OVER
    if (isVotingEnded) {
      const historyId = `${proposal.data.id}_${HistoryItemType.VOTING_OVER}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.VOTING_OVER,
        isVotingFailed
          ? texts.proposalHistory.votingFailed(forVotes, againstVotes)
          : texts.proposalHistory.votingOver,
        proposal.data.id,
        proposal.data.votingChainId,
        proposal.data.votingMachineData.endTime,
      );
    }

    // VOTING_CLOSED
    if (
      proposal.data.votingMachineData.votingClosedAndSentTimestamp > 0 &&
      !isVotingFailed
    ) {
      const historyId = `${proposal.data.id}_${HistoryItemType.VOTING_CLOSED}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.VOTING_CLOSED,
        texts.proposalHistory.proposalVotingClosed(
          proposal.data.id,
          proposal.data.votingChainId,
        ),
        proposal.data.id,
        proposal.data.votingChainId,
        proposal.data.votingMachineData.votingClosedAndSentTimestamp,
      );
    }

    // RESULTS_SENT
    if (proposal.data.votingMachineData.sentToGovernance && !isVotingFailed) {
      const historyId = `${proposal.data.id}_${HistoryItemType.RESULTS_SENT}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.RESULTS_SENT,
        texts.proposalHistory.votingResultsSent,
        proposal.data.id,
        appConfig.govCoreChainId,
      );
    }

    // PROPOSAL_QUEUED
    if (proposal.data.queuingTime > 0 && !isVotingFailed) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_QUEUED}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.PROPOSAL_QUEUED,
        texts.proposalHistory.proposalTimeLocked(proposal.data.id),
        proposal.data.id,
        appConfig.govCoreChainId,
        proposal.data.queuingTime,
      );
    }

    // PROPOSAL_EXECUTED
    if (proposal.data.basicState === BasicProposalState.Executed) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_EXECUTED}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.PROPOSAL_EXECUTED,
        texts.proposalHistory.proposalExecuted(proposal.data.id),
        proposal.data.id,
        appConfig.govCoreChainId,
      );
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
          get().initProposalHistoryItem(
            historyId,
            HistoryItemType.PAYLOADS_QUEUED,
            texts.proposalHistory.payloadTimeLocked(
              index + 1,
              proposal.data.payloads.length,
              payload.chainId,
            ),
            payload.id,
            payload.chainId,
            payload.queuedAt,
          );
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
          get().initProposalHistoryItem(
            historyId,
            HistoryItemType.PAYLOADS_EXECUTED,
            texts.proposalHistory.payloadExecuted(
              index + 1,
              proposal.data.payloads.length,
              payload.chainId,
            ),
            payload.id,
            payload.chainId,
            payload.executedAt,
          );
        }
      });
    }

    // PROPOSAL_CANCELED
    if (proposal.state === ProposalState.Canceled) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_CANCELED}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.PROPOSAL_CANCELED,
        texts.proposalHistory.proposalCanceled(proposal.data.id),
        proposal.data.id,
        appConfig.govCoreChainId,
        lastPayloadCanceledAt > proposal.data.canceledAt
          ? lastPayloadCanceledAt
          : proposal.data.canceledAt,
      );
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
          get().initProposalHistoryItem(
            historyId,
            HistoryItemType.PAYLOADS_EXPIRED,
            texts.proposalHistory.payloadExpired(
              index + 1,
              proposal.data.payloads.length,
              payload.chainId,
            ),
            payload.id,
            payload.chainId,
            payload.queuedAt <= 0
              ? payload.createdAt + payload.expirationTime
              : payload.queuedAt + payload.delay + payload.gracePeriod,
          );
        }
      });
    }

    // PROPOSAL_EXPIRED
    if (proposal.state === ProposalState.Expired) {
      const historyId = `${proposal.data.id}_${HistoryItemType.PROPOSAL_EXPIRED}`;
      get().initProposalHistoryItem(
        historyId,
        HistoryItemType.PROPOSAL_EXPIRED,
        texts.proposalHistory.proposalExpired(proposal.data.id),
        proposal.data.id,
        appConfig.govCoreChainId,
        proposal.data.basicState === BasicProposalState.Executed
          ? lastPayloadExpiredAt
          : proposal.data.creationTime + proposal.timings.expirationTime,
      );
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
              draft.proposalHistory[historyId].txInfo.hash ===
              ethers.constants.HashZero,
          },
        };
      }),
    );
  },
  setHistoryItemHash: (historyId, filteredEvents) => {
    const historyItem = get().proposalHistory[historyId];

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (historyItem.timestamp) {
        filteredEvents.forEach((event) =>
          set((state) =>
            produce(state, (draft) => {
              draft.proposalHistory[historyId] = {
                ...draft.proposalHistory[historyId],
                txInfo: {
                  ...draft.proposalHistory[historyId].txInfo,
                  hash:
                    draft.proposalHistory[historyId].txInfo.hash !==
                    ethers.constants.HashZero
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

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (historyItem.timestamp) {
        const { minBlockNumber, maxBlockNumber } =
          await getBlockNumberByTimestamp(
            txInfo.chainId,
            historyItem.timestamp,
            appConfig.providers[txInfo.chainId],
          );
        const events = await get().govDataService.getPayloadsCreatedEvents(
          txInfo.chainId,
          payloadControllerAddress,
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

        await get().setHistoryItemHash(historyId, filteredEvents);
      }
    }
  },

  // PROPOSAL_CREATED
  setProposalCreatedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.CREATED}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (historyItem.timestamp) {
        const { minBlockNumber, maxBlockNumber } =
          await getBlockNumberByTimestamp(
            txInfo.chainId,
            historyItem.timestamp,
            appConfig.providers[txInfo.chainId],
          );
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

        await get().setHistoryItemHash(historyId, filteredEvents);
      }
    }
  },

  // PROPOSAL_ACTIVATE
  setProposalActivatedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.PROPOSAL_ACTIVATE}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (historyItem.timestamp) {
        const { minBlockNumber, maxBlockNumber } =
          await getBlockNumberByTimestamp(
            txInfo.chainId,
            historyItem.timestamp,
            appConfig.providers[txInfo.chainId],
          );
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

        await get().setHistoryItemHash(historyId, filteredEvents);
      }
    }
  },

  // OPEN_TO_VOTE
  setProposalActivatedOnVMHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.OPEN_TO_VOTE}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (proposal.proposal.data.votingMachineData.createdBlock > 0) {
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

        await get().setHistoryItemHash(historyId, filteredEvents);
      }
    }
  },

  // VOTING_CLOSED
  setProposalVotingClosedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.VOTING_CLOSED}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (
        proposal.proposal.data.votingMachineData
          .votingClosedAndSentBlockNumber > 0
      ) {
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

        await get().setHistoryItemHash(historyId, filteredEvents);
      }
    }
  },

  // PROPOSAL_QUEUED
  setProposalQueuedHistoryHash: async (proposal, txInfo) => {
    const historyId = `${proposal.proposal.data.id}_${HistoryItemType.PROPOSAL_QUEUED}`;
    const historyItem = get().proposalHistory[historyId];

    get().setHistoryItemLoading(historyId);

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (historyItem.timestamp) {
        const { minBlockNumber, maxBlockNumber } =
          await getBlockNumberByTimestamp(
            txInfo.chainId,
            historyItem.timestamp,
            appConfig.providers[txInfo.chainId],
          );
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

        await get().setHistoryItemHash(historyId, filteredEvents);
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

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (historyItem.timestamp) {
        const { minBlockNumber, maxBlockNumber } =
          await getBlockNumberByTimestamp(
            txInfo.chainId,
            historyItem.timestamp,
            appConfig.providers[txInfo.chainId],
          );
        const events = await get().govDataService.getPayloadsQueuedEvents(
          txInfo.chainId,
          payloadControllerAddress,
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

        await get().setHistoryItemHash(historyId, filteredEvents);
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

    if (historyItem.txInfo.hash === ethers.constants.HashZero) {
      if (historyItem.timestamp) {
        const { minBlockNumber, maxBlockNumber } =
          await getBlockNumberByTimestamp(
            txInfo.chainId,
            historyItem.timestamp,
            appConfig.providers[txInfo.chainId],
          );
        const events = await get().govDataService.getPayloadsExecutedEvents(
          txInfo.chainId,
          payloadControllerAddress,
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

        await get().setHistoryItemHash(historyId, filteredEvents);
      }
    }
  },
});
