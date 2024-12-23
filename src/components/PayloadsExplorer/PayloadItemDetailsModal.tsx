import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Address, toHex } from 'viem';

import {
  formatPayloadData,
  generateSeatbeltLink,
} from '../../helpers/formatPayloadData';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { selectPayloadExploreById } from '../../store/selectors/payloadsExplorerSelectors';
import { TransactionUnion, TxType } from '../../store/transactionsSlice';
import { InitialPayload } from '../../types';
import { BasicModal } from '../BasicModal';
import { CopyAndExternalIconsSet } from '../CopyAndExternalIconsSet';
import { Link } from '../Link';
import { NetworkIcon } from '../NetworkIcon';
import { PayloadActions } from '../PayloadActions';
import { PayloadCreator } from '../PayloadCreator';
import { SmallButton } from '../SmallButton';
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
  const transactionsPool = useStore((store) => store.transactionsPool);
  const activeWallet = useStore((store) => store.activeWallet);
  const isPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.isPayloadExplorerItemDetailsModalOpen,
  );
  const getPayloadsExploreDataById = useStore(
    (store) => store.getPayloadsExploreDataById,
  );
  const setIsPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.setIsPayloadExplorerItemDetailsModalOpen,
  );
  const setExecutePayloadModalOpen = useStore(
    (store) => store.setExecutePayloadModalOpen,
  );

  const payload = useStore((store) =>
    selectPayloadExploreById({
      payloadsExploreData: store.payloadsExploreData,
      chainId: initialPayload.chainId,
      address: initialPayload.payloadsController as Address,
      payloadId: initialPayload.id,
    }),
  );

  useEffect(() => {
    getPayloadsExploreDataById(
      initialPayload.chainId,
      initialPayload.payloadsController as Address,
      initialPayload.id,
    );
  }, []);

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

        <Box>
          <Link
            href={generateSeatbeltLink(payload)}
            inNewWindow
            css={{ display: 'block', mt: 4 }}>
            <SmallButton>
              {texts.proposals.payloadsDetails.seatbelt}
            </SmallButton>
          </Link>
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
                    if (setSelectedPayloadForExecute) {
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
    </BasicModal>
  );
}
