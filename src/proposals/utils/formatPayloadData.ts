import { PayloadState } from '@bgd-labs/aave-governance-ui-helpers';
import dayjs from 'dayjs';

import { NewPayload } from '../../proposalCreateOverview/store/proposalCreateOverviewSlice';

export const seatbeltStartLink =
  'https://github.com/bgd-labs/seatbelt-gov-v3/blob/main/reports/payloads/';

export function formatPayloadData({
  payload,
  isProposalExecuted = true,
  proposalQueuingTime,
  forCreate,
  totalPayloadsCount,
  payloadCount,
  withoutProposalData,
}: {
  payload: NewPayload;
  isProposalExecuted?: boolean;
  proposalQueuingTime?: number;
  forCreate?: boolean;
  totalPayloadsCount?: number;
  payloadCount?: number;
  withoutProposalData?: boolean;
}) {
  const now = dayjs().unix();
  const isProposalNotExecuted = withoutProposalData
    ? true
    : !isProposalExecuted;

  const isPayloadOnInitialState =
    payload.queuedAt <= 0 &&
    isProposalNotExecuted &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const isPayloadTimeLocked =
    payload.queuedAt <= 0 &&
    isProposalNotExecuted &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const payloadExecutionTime =
    payload.queuedAt <= 0
      ? (proposalQueuingTime || now) + payload.delay
      : payload.queuedAt + payload.delay;

  const isPayloadReadyForExecution =
    !isProposalNotExecuted &&
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
  if (isPayloadOnInitialState) {
    statusText = 'Created';
  } else if (
    !isPayloadOnInitialState &&
    !isFinalStatus &&
    !isPayloadReadyForExecution
  ) {
    statusText = 'Queued';
  } else if (
    !isPayloadOnInitialState &&
    !isFinalStatus &&
    isPayloadReadyForExecution
  ) {
    statusText = 'Can be execute';
  } else if (isExecuted) {
    statusText = 'Executed';
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
  };
}
