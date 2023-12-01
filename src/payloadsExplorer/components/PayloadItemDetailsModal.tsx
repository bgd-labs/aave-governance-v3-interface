import { InitialPayload } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import React from 'react';
import { toHex } from 'viem';

import { PayloadActions } from '../../proposals/components/proposal/PayloadActions';
import { PayloadCreator } from '../../proposals/components/proposal/PayloadCreator';
import {
  formatPayloadData,
  seatbeltStartLink,
} from '../../proposals/utils/formatPayloadData';
import { useStore } from '../../store';
import { BasicModal, Link, SmallButton } from '../../ui';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { texts } from '../../ui/utils/texts';
import { PayloadStatus } from './PayloadStatus';

interface PayloadItemDetailsModalProps {
  initialPayload: InitialPayload;
}

export function PayloadItemDetailsModal({
  initialPayload,
}: PayloadItemDetailsModalProps) {
  const {
    isPayloadExplorerItemDetailsModalOpen,
    setIsPayloadExplorerItemDetailsModalOpen,
    payloadsExploreData,
  } = useStore();

  const payload =
    payloadsExploreData[initialPayload.chainId][
      initialPayload.payloadsController
    ][`${initialPayload.payloadsController}_${initialPayload.id}`];

  if (!payload) return null;

  const {
    isPayloadOnInitialState,
    payloadExecutionTime,
    isPayloadReadyForExecution,
    isExecuted,
    payloadExpiredTime,
    payloadNumber,
    isFinalStatus,
    statusText,
  } = formatPayloadData({
    payload,
    forCreate: true,
    withoutProposalData: true,
  });

  return (
    <BasicModal
      isOpen={isPayloadExplorerItemDetailsModalOpen}
      setIsOpen={setIsPayloadExplorerItemDetailsModalOpen}
      withCloseButton>
      <Box sx={{ pt: 20 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            mb: 30,
          }}>
          <NetworkIcon
            chainId={payload.chainId}
            size={16}
            css={{ mr: 6 }}
            withTooltip={true}
          />
          <Box sx={{ typography: 'h2' }}>
            {texts.proposals.payloadsDetails.payload} {payloadNumber}
          </Box>
        </Box>

        <Box sx={{ mb: 12, typography: 'headline' }}>
          Id(Hex): {toHex(payload.id)}
        </Box>

        <Box sx={{ mb: 12, typography: 'headline' }}>
          {texts.proposals.payloadsDetails.accessLevel}:{' '}
          {payload.maximumAccessLevelRequired}
        </Box>

        <Box sx={{ mb: 12, typography: 'headline' }}>
          {texts.proposals.payloadsDetails.details}:{' '}
          <Box sx={{ display: 'inline', typography: 'body' }}>{statusText}</Box>
        </Box>

        <PayloadCreator
          payload={payload}
          ellipsisFrom={14}
          iconSize={12}
          mb={12}
          mainTypography="headline"
          addressTypography="body"
        />
        <PayloadStatus
          mb={12}
          payload={payload}
          isFinalStatus={isFinalStatus}
          isPayloadOnInitialState={isPayloadOnInitialState}
          isPayloadReadyForExecution={isPayloadReadyForExecution}
          isExecuted={isExecuted}
          payloadExecutionTime={payloadExecutionTime}
          payloadExpiredTime={payloadExpiredTime}
          titleTypography="headline"
          textTypography="body"
        />

        <Link
          href={`${seatbeltStartLink}${payload.chainId}/${payload.payloadsController}/${payload.id}.md`}
          inNewWindow
          css={{ display: 'block', mt: 4 }}>
          <SmallButton>{texts.proposals.payloadsDetails.seatbelt}</SmallButton>
        </Link>

        <Box sx={{ mt: 30 }}>
          <Box sx={{ typography: 'headline', mb: 4 }}>
            {texts.proposals.payloadsDetails.actions(
              payload.actionAddresses?.length || 0,
            )}
            :
          </Box>
          <PayloadActions
            payload={payload}
            withoutTitle
            textColor="$text"
            withoutEllipsis
          />
        </Box>
      </Box>
    </BasicModal>
  );
}
