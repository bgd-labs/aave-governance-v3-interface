import { InitialPayload, Payload } from '@bgd-labs/aave-governance-ui-helpers';
import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import React from 'react';
import { toHex } from 'viem';

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
import { BoxWith3D, Link, SmallButton } from '../../ui';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { texts } from '../../ui/utils/texts';
import { PayloadStatus } from './PayloadStatus';

export function PayloadExploreItem({
  payload,
  setSelectedPayloadForExecute,
  setSelectedPayloadForDetailsModal,
}: {
  payload: Payload;
  setSelectedPayloadForExecute: ({
    chainId,
    payloadsController,
    id,
  }: InitialPayload) => void;
  setSelectedPayloadForDetailsModal: ({
    chainId,
    payloadsController,
    id,
  }: InitialPayload) => void;
}) {
  const theme = useTheme();
  const store = useStore();

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

  const statusColor = isExecuted
    ? '$mainFor'
    : !isPayloadOnInitialState && !isFinalStatus && isPayloadReadyForExecution
      ? '$mainFor'
      : !isPayloadOnInitialState &&
          !isFinalStatus &&
          !isPayloadReadyForExecution
        ? '$secondary'
        : isPayloadOnInitialState
          ? '$disabled'
          : '$disabled';

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

  const handleDetailsOpen = () => {
    setSelectedPayloadForDetailsModal({
      chainId: payload.chainId,
      payloadsController: payload.payloadsController,
      id: payload.id,
    });
    store.setIsPayloadExplorerItemDetailsModalOpen(true);
  };

  return (
    <BoxWith3D
      contentColor="$mainLight"
      wrapperCss={{ mb: 18, [theme.breakpoints.up('sm')]: { mb: 24 } }}
      css={{
        display: 'flex',
        flexDirection: 'column',
        p: '18px',
        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: '18px 24px',
        },
        [theme.breakpoints.up('lg')]: {
          p: '22px 30px',
        },
      }}>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              mb: 12,
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
        </Box>

        <Box sx={{ display: 'flex', mb: 4 }}>
          <Box sx={{ typography: 'headline', mr: 12 }}>
            Id(Hex): {toHex(payload.id)}
          </Box>

          <Box sx={{ typography: 'headline' }}>
            {texts.proposals.payloadsDetails.accessLevel}:{' '}
            {payload.maximumAccessLevelRequired}
          </Box>
        </Box>

        <PayloadCreator
          payload={payload}
          mainTypography="headline"
          addressTypography="body"
        />
        <PayloadStatus
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
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          my: 18,
          [theme.breakpoints.up('sm')]: {
            my: 0,
            alignItems: 'center',
          },
        }}>
        <Box
          sx={{
            '.PayloadActions__link': {
              typography: 'body',
              hover: { opacity: 0.7 },
            },
          }}>
          <Box sx={{ typography: 'h2', mb: 12 }}>
            {texts.proposals.payloadsDetails.actions(
              payload.actionAddresses?.length || 0,
            )}
            :
          </Box>
          <PayloadActions
            payload={payload}
            withoutTitle
            textColor="$text"
            showMoreClick={handleDetailsOpen}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flex: 1,
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${theme.palette[statusColor]}`,
            color: `${theme.palette[statusColor]}`,
            typography: 'headline',
            p: '4px 8px',
            minWidth: 95,
            order: 1,
            [theme.breakpoints.up('sm')]: {
              order: 0,
              mb: 12,
            },
            [theme.breakpoints.up('lg')]: {
              minWidth: 102,
            },
          }}>
          {statusText}
        </Box>

        <Box>
          <Link
            href={`${seatbeltStartLink}${payload.chainId}/${payload.payloadsController}/${payload.id}.md`}
            inNewWindow
            css={{ display: 'flex', alignItems: 'center' }}>
            <SmallButton
              onClick={(e) => {
                e.stopPropagation();
              }}>
              {texts.proposals.payloadsDetails.seatbelt}
            </SmallButton>
          </Link>

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
                        chainId: payload.chainId,
                        payloadsController: payload.payloadsController,
                        id: payload.id,
                      });
                    }
                    store.setExecutePayloadModalOpen(true);
                  }}>
                  {texts.proposals.payloadsDetails.execute}
                </SmallButton>
              </Box>
            )}
        </Box>
      </Box>
    </BoxWith3D>
  );
}
