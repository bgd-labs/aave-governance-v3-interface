import dayjs from 'dayjs';
import { metis, scroll, zkSync } from 'viem/chains';

import { InitialPayloadState, PayloadWithHashes } from '../types';

export const seatbeltStartLink =
  'https://raw.githubusercontent.com/bgd-labs/seatbelt-gov-v3/main/reports/payloads/';

export const generateSeatbeltLink = (
  payload: PayloadWithHashes,
  startLink?: string,
) => {
  let isForgeReport = false;
  if (
    Number(payload.chain) === metis.id ||
    Number(payload.chain) === zkSync.id
  ) {
    isForgeReport = true;
  } else if (Number(payload.chain) === scroll.id) {
    isForgeReport = true;
  }
  return `${startLink || seatbeltStartLink}${Number(payload.chain)}/${payload.payloadsController}/${payload.id}${isForgeReport ? '_forge' : ''}.md`;
};

export function formatPayloadData({
  payload,
  isProposalExecuted = true,
  proposalQueuingTime,
  forCreate,
  totalPayloadsCount,
  payloadCount,
  withoutProposalData,
}: {
  payload: PayloadWithHashes;
  isProposalExecuted?: boolean;
  proposalQueuingTime?: number;
  forCreate?: boolean;
  totalPayloadsCount?: number;
  payloadCount?: number;
  withoutProposalData?: boolean;
}) {
  const now = dayjs().unix();

  const isPayloadOnInitialState =
    payload.data.queuedAt <= 0 &&
    (withoutProposalData ? true : !isProposalExecuted) &&
    payload.data.cancelledAt <= 0 &&
    payload.data.state !== InitialPayloadState.Expired;

  const isPayloadTimeLocked =
    payload.data.queuedAt <= 0 &&
    (withoutProposalData ? true : isProposalExecuted) &&
    payload.data.cancelledAt <= 0 &&
    payload.data.state !== InitialPayloadState.Expired;

  const payloadExecutionTime =
    payload.data.queuedAt <= 0
      ? (proposalQueuingTime || now) + payload.data.delay
      : payload.data.queuedAt + payload.data.delay;

  const isPayloadReadyForExecution =
    (withoutProposalData ? true : isProposalExecuted) &&
    payload.data.queuedAt > 0 &&
    now > payload.data.queuedAt + payload.data.delay &&
    payload.data.cancelledAt <= 0 &&
    payload.data.state !== InitialPayloadState.Expired;

  const isExecuted = payload.data.executedAt > 0;

  let payloadExpiredTime = 0;
  if (
    payload?.data.state &&
    payload.data.state === InitialPayloadState.Created
  ) {
    payloadExpiredTime = payload.data.expirationTime;
  } else if (
    payload?.data.state &&
    payload.data.state === InitialPayloadState.Queued
  ) {
    payloadExpiredTime =
      payload.data.queuedAt + payload.data.delay + payload.data.gracePeriod;
  }

  const isFinalStatus =
    isExecuted ||
    payload.data.cancelledAt > 0 ||
    payload.data.state === InitialPayloadState.Expired;

  const payloadNumber = forCreate
    ? `id #${payload.id}`
    : totalPayloadsCount && totalPayloadsCount > 1
      ? `${payloadCount}/${totalPayloadsCount}`
      : '';

  let statusText = 'Created';
  let txHash = payload.createdTransactionHash ?? '';
  if (isPayloadOnInitialState) {
    statusText = 'Created';
    txHash = payload.createdTransactionHash ?? '';
  } else if (
    !isPayloadOnInitialState &&
    !isFinalStatus &&
    !isPayloadReadyForExecution
  ) {
    statusText = 'Queued';
    txHash = payload.queuedTransactionHash ?? '';
  } else if (
    !isPayloadOnInitialState &&
    !isFinalStatus &&
    isPayloadReadyForExecution
  ) {
    statusText = 'Can be executed';
  } else if (isExecuted) {
    statusText = 'Executed';
    txHash = payload.executedTransactionHash ?? '';
  } else if (payload.data.state === InitialPayloadState.Expired) {
    statusText = 'Expired';
  } else if (payload.data.state === InitialPayloadState.Cancelled) {
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
