import { InitialPayload } from '@bgd-labs/aave-governance-ui-helpers';
import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { toHex } from 'viem';
import { metis } from 'viem/chains';

import { PayloadActions } from '../../proposals/components/proposal/PayloadActions';
import { PayloadCreator } from '../../proposals/components/proposal/PayloadCreator';
import {
  formatPayloadData,
  seatbeltStartLink,
} from '../../proposals/utils/formatPayloadData';
import { useStore } from '../../store';
import {
  TransactionUnion,
  TxType,
} from '../../transactions/store/transactionsSlice';
import { BasicModal, Link, SmallButton } from '../../ui';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { texts } from '../../ui/utils/texts';
import { selectPayloadExploreById } from '../store/payloadsExplorerSelectors';
import { PayloadStatus } from './PayloadStatus';

interface PayloadItemDetailsModalProps {
  initialPayload: InitialPayload;
  setSelectedPayloadForExecute: ({
    chainId,
    payloadsController,
    id,
  }: InitialPayload) => void;
}

export function PayloadItemDetailsModal({
  initialPayload,
  setSelectedPayloadForExecute,
}: PayloadItemDetailsModalProps) {
  const store = useStore();
  const {
    isPayloadExplorerItemDetailsModalOpen,
    setIsPayloadExplorerItemDetailsModalOpen,
    getPayloadsExploreDataById,
  } = store;

  useEffect(() => {
    getPayloadsExploreDataById(
      initialPayload.chainId,
      initialPayload.payloadsController,
      initialPayload.id,
    );
  }, []);

  const payload = selectPayloadExploreById(
    store,
    initialPayload.chainId,
    initialPayload.payloadsController,
    initialPayload.id,
  );

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
    store.activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      store,
      store.activeWallet.address,
      TxType.executePayload,
      {
        proposalId: 0,
        payloadId: payload.id,
        chainId: payload.chainId,
        payloadController: payload.payloadsController,
      },
    );

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

        <Box>
          {payload.chainId !== metis.id && (
            <Link
              href={`${seatbeltStartLink}${payload.chainId}/${payload.payloadsController}/${payload.id}.md`}
              inNewWindow
              css={{ display: 'block', mt: 4 }}>
              <SmallButton>
                {texts.proposals.payloadsDetails.seatbelt}
              </SmallButton>
            </Link>
          )}
        </Box>

        <Box>
          {isPayloadReadyForExecution &&
            !isFinalStatus &&
            store.activeWallet?.isActive && (
              <Box sx={{ mt: 4 }}>
                <SmallButton
                  disabled={tx?.status === TransactionStatus.Success}
                  loading={tx?.pending}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!!setSelectedPayloadForExecute) {
                      setSelectedPayloadForExecute({
                        chainId: payload?.chainId,
                        payloadsController: payload?.payloadsController,
                        id: payload?.id,
                      });
                    }
                    store.setIsPayloadExplorerItemDetailsModalOpen(false);
                    store.setExecutePayloadModalOpen(true);
                  }}>
                  {texts.proposals.payloadsDetails.execute}
                </SmallButton>
              </Box>
            )}
        </Box>

        <Box sx={{ mt: 30 }}>
          <Box sx={{ typography: 'headline', mb: 4 }}>
            {texts.proposals.payloadsDetails.actions(
              payload.actions?.length || 0,
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
