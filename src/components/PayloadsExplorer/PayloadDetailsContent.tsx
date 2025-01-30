'use client';

import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React from 'react';
import { Address, toHex } from 'viem';

import {
  formatPayloadData,
  generateSeatbeltLink,
} from '../../helpers/formatPayloadData';
import { texts } from '../../helpers/texts/texts';
import { useGetSeatbeltReportPayloadsExplorer } from '../../hooks/useGetSeatbeltReportPayloadsExplorer';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TransactionUnion, TxType } from '../../store/transactionsSlice';
import { PayloadWithHashes } from '../../types';
import { CopyAndExternalIconsSet } from '../CopyAndExternalIconsSet';
import { NetworkIcon } from '../NetworkIcon';
import { PayloadActions } from '../PayloadActions';
import { PayloadCreator } from '../PayloadCreator';
import { SeatBeltReportModal } from '../SeatBeltReportModal';
import { SmallButton } from '../SmallButton';
import { PayloadStatus } from './PayloadStatus';

export function PayloadDetailsContent({
  payload,
  withExecute,
}: {
  payload: PayloadWithHashes;
  withExecute?: boolean;
}) {
  const transactionsPool = useStore((store) => store.transactionsPool);
  const activeWallet = useStore((store) => store.activeWallet);

  const setIsPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.setIsPayloadExplorerItemDetailsModalOpen,
  );
  const setExecutePayloadModalOpen = useStore(
    (store) => store.setExecutePayloadModalOpen,
  );
  const setSelectedPayloadForExecute = useStore(
    (store) => store.setSelectedPayloadForExecute,
  );

  const {
    handleReportClick,
    isSeatbeltReportLoading,
    isSeatbeltModalOpen,
    finalReport,
    reportPayload,
    handleSeatbeltModalOpen,
  } = useGetSeatbeltReportPayloadsExplorer();

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

  const tx =
    activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      transactionsPool,
      activeWallet.address,
      TxType.executePayload,
      {
        proposalId: 0,
        payloadId: Number(payload.id),
        chainId: Number(payload.chain),
        payloadController: payload.payloadsController,
      },
    );

  return (
    <>
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
            chainId={Number(payload.chain)}
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

        {(!!payload.proposalId || payload.proposalId === 0) && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              mb: 12,
              typography: 'headline',
            }}>
            Proposal id: {payload.proposalId}{' '}
            <CopyAndExternalIconsSet
              externalLink={`/proposal?proposalId=${payload.proposalId}`}
              iconSize={14}
              sx={{ '.CopyAndExternalIconsSet__link': { ml: 6 } }}
            />
          </Box>
        )}

        <Box sx={{ mb: 12, typography: 'headline' }}>
          {texts.proposals.payloadsDetails.accessLevel}:{' '}
          {payload.data.maximumAccessLevelRequired}
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

        <Box sx={{ mt: 12 }}>
          <SmallButton
            disabled={
              isSeatbeltModalOpen[`${payload.payloadsController}_${payload.id}`]
            }
            loading={
              isSeatbeltReportLoading[
                `${payload.payloadsController}_${payload.id}`
              ]
            }
            onClick={async (e) => {
              e.stopPropagation();
              await handleReportClick(payload);
            }}>
            {texts.proposals.payloadsDetails.seatbelt}
          </SmallButton>
        </Box>

        <Box>
          {isPayloadReadyForExecution &&
            !isFinalStatus &&
            activeWallet?.isActive && (
              <Box sx={{ mt: 4 }}>
                <SmallButton
                  disabled={tx?.status === TransactionStatus.Success}
                  loading={tx?.pending}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (withExecute) {
                      setSelectedPayloadForExecute({
                        chainId: Number(payload.chain),
                        payloadsController:
                          payload.payloadsController as Address,
                        id: Number(payload.id),
                      });
                    }
                    setIsPayloadExplorerItemDetailsModalOpen(false);
                    setExecutePayloadModalOpen(true);
                  }}>
                  {texts.proposals.payloadsDetails.execute}
                </SmallButton>
              </Box>
            )}
        </Box>

        <Box sx={{ mt: 30 }}>
          <Box sx={{ typography: 'headline', mb: 4 }}>
            {texts.proposals.payloadsDetails.actions(
              payload.data.actions?.length || 0,
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

      {finalReport && !!reportPayload && (
        <SeatBeltReportModal
          isOpen={
            isSeatbeltModalOpen[
              `${reportPayload.payloadsController}_${reportPayload.id}`
            ]
          }
          setIsOpen={handleSeatbeltModalOpen}
          report={finalReport}
          link={generateSeatbeltLink(reportPayload)}
        />
      )}
    </>
  );
}
