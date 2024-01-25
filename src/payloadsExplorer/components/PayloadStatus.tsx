import { PayloadState } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';

import { NewPayload } from '../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { PayloadItemStatusInfo } from '../../proposals/components/proposal/ProposalPayloads';
import { Timer } from '../../ui';
import { texts } from '../../ui/utils/texts';

interface PayloadStatusProps {
  payload: NewPayload;
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
            <>{dayjs.unix(payload.createdAt).format('MMM D, YYYY, h:mm A')}</>
          </PayloadItemStatusInfo>
        )}

        {!isPayloadOnInitialState &&
          !isPayloadReadyForExecution &&
          !isFinalStatus && (
            <PayloadItemStatusInfo
              titleTypography={titleTypography}
              textTypography={textTypography}
              title={texts.proposals.payloadsDetails.executedIn}>
              <Timer timestamp={payloadExecutionTime} />
            </PayloadItemStatusInfo>
          )}

        {isExecuted && (
          <PayloadItemStatusInfo
            titleTypography={titleTypography}
            textTypography={textTypography}
            title={texts.proposals.payloadsDetails.executedAt}>
            <>{dayjs.unix(payload.executedAt).format('MMM D, YYYY, h:mm A')}</>
          </PayloadItemStatusInfo>
        )}

        {payload.cancelledAt > 0 && (
          <PayloadItemStatusInfo
            titleTypography={titleTypography}
            textTypography={textTypography}
            title={texts.proposals.payloadsDetails.cancelledAt}>
            <>{dayjs.unix(payload.cancelledAt).format('MMM D, YYYY, h:mm A')}</>
          </PayloadItemStatusInfo>
        )}

        {payload.state === PayloadState.Expired && (
          <PayloadItemStatusInfo
            titleTypography={titleTypography}
            textTypography={textTypography}
            title={texts.proposals.payloadsDetails.expired}>
            <>
              {dayjs
                .unix(
                  payload.queuedAt <= 0
                    ? payload.expirationTime
                    : payload.queuedAt + payload.delay + payload.gracePeriod,
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
          <Timer timestamp={payloadExpiredTime} />
        </PayloadItemStatusInfo>
      )}
    </>
  );
}
