import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import { texts } from '../../helpers/texts/texts';
import { InitialPayloadState, PayloadWithHashes } from '../../types';
import { PayloadItemStatusInfo } from '../ProposalsDetails/ProposalPayloads';
import { Timer } from '../Timer';

interface PayloadStatusProps {
  payload: PayloadWithHashes;
  isPayloadOnInitialState: boolean;
  isPayloadReadyForExecution: boolean;
  isExecuted: boolean;
  isFinalStatus: boolean;
  payloadExecutionTime: number;
  payloadExpiredTime: number;
  titleTypography?: string;
  textTypography?: string;
  mb?: number;
}

export function PayloadStatus({
  payload,
  isPayloadOnInitialState,
  isPayloadReadyForExecution,
  isExecuted,
  isFinalStatus,
  payloadExecutionTime,
  payloadExpiredTime,
  titleTypography,
  textTypography,
  mb,
}: PayloadStatusProps) {
  return (
    <>
      <Box sx={{ mb: mb || 4 }}>
        {isPayloadOnInitialState && (
          <PayloadItemStatusInfo
            titleTypography={titleTypography}
            textTypography={textTypography}
            title={texts.proposals.payloadsDetails.created}>
            <>
              {dayjs.unix(payload.data.createdAt).format('MMM D, YYYY, h:mm A')}
            </>
          </PayloadItemStatusInfo>
        )}

        {!isPayloadOnInitialState &&
          !isPayloadReadyForExecution &&
          !isFinalStatus && (
            <PayloadItemStatusInfo
              titleTypography={titleTypography}
              textTypography={textTypography}
              title={texts.proposals.payloadsDetails.executedIn}>
              <Timer expiryTimestamp={payloadExecutionTime} />
            </PayloadItemStatusInfo>
          )}

        {isExecuted && (
          <PayloadItemStatusInfo
            titleTypography={titleTypography}
            textTypography={textTypography}
            title={texts.proposals.payloadsDetails.executedAt}>
            <>
              {dayjs
                .unix(payload.data.executedAt)
                .format('MMM D, YYYY, h:mm A')}
            </>
          </PayloadItemStatusInfo>
        )}

        {payload.data.cancelledAt > 0 && (
          <PayloadItemStatusInfo
            titleTypography={titleTypography}
            textTypography={textTypography}
            title={texts.proposals.payloadsDetails.cancelledAt}>
            <>
              {dayjs
                .unix(payload.data.cancelledAt)
                .format('MMM D, YYYY, h:mm A')}
            </>
          </PayloadItemStatusInfo>
        )}

        {payload.data.state === InitialPayloadState.Expired && (
          <PayloadItemStatusInfo
            titleTypography={titleTypography}
            textTypography={textTypography}
            title={texts.proposals.payloadsDetails.expired}>
            <>
              {dayjs
                .unix(
                  payload.data.queuedAt <= 0
                    ? payload.data.expirationTime
                    : payload.data.queuedAt +
                        payload.data.delay +
                        payload.data.gracePeriod,
                )
                .format('MMM D, YYYY, h:mm A')}
            </>
          </PayloadItemStatusInfo>
        )}
      </Box>

      {!isFinalStatus && (
        <PayloadItemStatusInfo
          titleTypography={titleTypography}
          textTypography={textTypography}
          title={texts.proposals.payloadsDetails.expiredIn}>
          <Timer expiryTimestamp={payloadExpiredTime} />
        </PayloadItemStatusInfo>
      )}
    </>
  );
}
