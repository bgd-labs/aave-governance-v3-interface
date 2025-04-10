import {
  HistoryItemType,
  PayloadState,
  ProposalHistoryItem,
} from '@bgd-labs/aave-governance-ui-helpers';
import dayjs from 'dayjs';
import { celo } from 'viem/chains';

import { NewPayload } from '../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { getHistoryId } from '../components/proposalHistory/helpers';

export const seatbeltStartLink =
  'https://github.com/bgd-labs/seatbelt-gov-v3/blob/main/reports/payloads/';

export const generateSeatbeltLink = (
  payload: NewPayload,
  startLink?: string,
) => {
  let isForgeReport = false;
  if (payload.chainId === celo.id) {
    isForgeReport = true;
  }
  return `${startLink || seatbeltStartLink}${payload.chainId}/${payload.payloadsController}/${payload.id}${isForgeReport ? '_forge' : ''}.md`;
};

function getTxHashFromHistory({
  payload,
  type,
  proposalId,
  proposalHistory,
}: {
  payload: NewPayload;
  type:
    | HistoryItemType.PAYLOADS_CREATED
    | HistoryItemType.PAYLOADS_QUEUED
    | HistoryItemType.PAYLOADS_EXECUTED;
  proposalId?: number;
  proposalHistory?: Record<string, ProposalHistoryItem>;
}) {
  if (proposalId && proposalHistory) {
    const historyId = getHistoryId({
      proposalId,
      type: type,
      id: payload.id,
      chainId: payload.chainId,
    });
    const historyItem = proposalHistory[historyId];
    if (historyItem) {
      return historyItem.txInfo.hash;
    }
  }
  return undefined;
}

export function formatPayloadData({
  payload,
  isProposalExecuted = true,
  proposalId,
  proposalQueuingTime,
  forCreate,
  totalPayloadsCount,
  payloadCount,
  withoutProposalData,
  proposalHistory,
}: {
  payload: NewPayload;
  isProposalExecuted?: boolean;
  proposalId?: number;
  proposalQueuingTime?: number;
  forCreate?: boolean;
  totalPayloadsCount?: number;
  payloadCount?: number;
  withoutProposalData?: boolean;
  proposalHistory?: Record<string, ProposalHistoryItem>;
}) {
  const now = dayjs().unix();

  const isPayloadOnInitialState =
    payload.queuedAt <= 0 &&
    (withoutProposalData ? true : !isProposalExecuted) &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const isPayloadTimeLocked =
    payload.queuedAt <= 0 &&
    (withoutProposalData ? true : isProposalExecuted) &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const payloadExecutionTime =
    payload.queuedAt <= 0
      ? (proposalQueuingTime || now) + payload.delay
      : payload.queuedAt + payload.delay;

  const isPayloadReadyForExecution =
    (withoutProposalData ? true : isProposalExecuted) &&
    payload.queuedAt > 0 &&
    now > payload.queuedAt + payload.delay &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const isExecuted = payload.executedAt > 0;

  let payloadExpiredTime = 0;
  if (payload?.state && payload.state === PayloadState.Created) {
    payloadExpiredTime = payload.expirationTime;
  } else if (payload?.state && payload.state === PayloadState.Queued) {
    payloadExpiredTime = payload.queuedAt + payload.delay + payload.gracePeriod;
  }

  const isFinalStatus =
    isExecuted ||
    payload.cancelledAt > 0 ||
    payload.state === PayloadState.Expired;

  const payloadNumber = forCreate
    ? `id #${payload.id}`
    : totalPayloadsCount && totalPayloadsCount > 1
      ? `${payloadCount}/${totalPayloadsCount}`
      : '';

  let statusText = 'Created';
  let txHash = getTxHashFromHistory({
    type: HistoryItemType.PAYLOADS_CREATED,
    payload,
    proposalHistory,
    proposalId,
  });
  if (isPayloadOnInitialState) {
    statusText = 'Created';
  } else if (
    !isPayloadOnInitialState &&
    !isFinalStatus &&
    !isPayloadReadyForExecution
  ) {
    statusText = 'Queued';
    txHash = getTxHashFromHistory({
      type: HistoryItemType.PAYLOADS_QUEUED,
      payload,
      proposalHistory,
      proposalId,
    });
  } else if (
    !isPayloadOnInitialState &&
    !isFinalStatus &&
    isPayloadReadyForExecution
  ) {
    statusText = 'Can be executed';
  } else if (isExecuted) {
    statusText = 'Executed';
    txHash = getTxHashFromHistory({
      type: HistoryItemType.PAYLOADS_EXECUTED,
      payload,
      proposalHistory,
      proposalId,
    });
  } else if (payload.state === PayloadState.Expired) {
    statusText = 'Expired';
  } else if (payload.state === PayloadState.Cancelled) {
    statusText = 'Cancelled';
  }

  return {
    isPayloadOnInitialState,
    isPayloadTimeLocked,
    payloadExecutionTime,
    isPayloadReadyForExecution,
    isExecuted,
    payloadExpiredTime,
    isFinalStatus,
    payloadNumber,
    statusText,
    txHash,
  };
}
