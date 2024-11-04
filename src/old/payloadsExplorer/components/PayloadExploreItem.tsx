import { InitialPayload, Payload } from '@bgd-labs/aave-governance-ui-helpers';
import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import React from 'react';
import { Address, toHex } from 'viem';

import { NewPayload } from '../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { PayloadActions } from '../../proposals/components/proposal/PayloadActions';
import { PayloadCreator } from '../../proposals/components/proposal/PayloadCreator';
import { formatPayloadData } from '../../proposals/utils/formatPayloadData';
import { useStore } from '../../store/ZustandStoreProvider';
import {
  TransactionUnion,
  TxType,
} from '../../transactions/store/transactionsSlice';
import { BoxWith3D, SmallButton } from '../../ui';
import { CopyAndExternalIconsSet } from '../../ui/components/CopyAndExternalIconsSet';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { texts } from '../../ui/utils/texts';
import { media } from '../../ui/utils/themeMUI';
import { useMediaQuery } from '../../ui/utils/useMediaQuery';
import { PayloadStatus } from './PayloadStatus';

export function PayloadExploreItem({
  payload,
  setSelectedPayloadForExecute,
  setSelectedPayloadForDetailsModal,
  isColumns,
  handleReportClick,
  isSeatbeltModalOpen,
  isSeatbeltReportLoading,
}: {
  payload: Payload & { proposalId?: number };
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
  isColumns: boolean;
  handleReportClick: (payload: NewPayload) => Promise<void>;
  isSeatbeltReportLoading: Record<string, boolean>;
  isSeatbeltModalOpen: Record<string, boolean>;
}) {
  const theme = useTheme();
  const xsm = useMediaQuery(media.xs);

  const transactionsPool = useStore((store) => store.transactionsPool);
  const activeWallet = useStore((store) => store.activeWallet);
  const setExecutePayloadModalOpen = useStore(
    (store) => store.setExecutePayloadModalOpen,
  );
  const setIsPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.setIsPayloadExplorerItemDetailsModalOpen,
  );

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
    activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      transactionsPool,
      activeWallet.address,
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
      payloadsController: payload.payloadsController as Address,
      id: payload.id,
    });
    setIsPayloadExplorerItemDetailsModalOpen(true);
  };

  return (
    <BoxWith3D
      contentColor="$mainLight"
      wrapperCss={{
        mb: isColumns ? 0 : 18,
        [theme.breakpoints.up('sm')]: { mb: isColumns ? 0 : 24 },
        '> div, .BoxWith3D__content': {
          height: isColumns ? '100%' : 'auto',
        },
      }}
      css={{
        display: 'flex',
        flexDirection: 'column',
        p: isColumns ? '12px 8px' : '18px',
        [theme.breakpoints.up('sm')]: {
          flexDirection: isColumns ? 'column' : 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: '18px 24px',
        },
        [theme.breakpoints.up('lg')]: {
          p: isColumns ? '14px 12px' : '22px 30px',
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
            <Box
              sx={{ display: 'flex', alignItems: 'center', typography: 'h2' }}>
              {texts.proposals.payloadsDetails.payload} {payloadNumber}
              <CopyAndExternalIconsSet
                copyTooltipText={toHex(payload.id)}
                iconSize={14}
                copyText={toHex(payload.id)}
                sx={{ '.CopyAndExternalIconsSet__copy': { ml: 8 } }}
              />
            </Box>
          </Box>
        </Box>
        {(!!payload.proposalId || payload.proposalId === 0) && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              typography: isColumns && xsm ? 'descriptorAccent' : 'headline',
              mb: 4,
            }}>
            Proposal id: {payload.proposalId}{' '}
            <CopyAndExternalIconsSet
              externalLink={`/proposal?proposalId=${payload.proposalId}`}
              iconSize={12}
              sx={{ '.CopyAndExternalIconsSet__link': { ml: 4 } }}
            />
          </Box>
        )}

        <Box
          sx={{
            typography: isColumns && xsm ? 'descriptorAccent' : 'headline',
            mb: 4,
          }}>
          {texts.proposals.payloadsDetails.accessLevel}:{' '}
          {payload.maximumAccessLevelRequired}
        </Box>

        <PayloadCreator
          payload={payload}
          mainTypography={isColumns && xsm ? 'descriptorAccent' : 'headline'}
          addressTypography={isColumns && xsm ? 'descriptor' : 'body'}
          ellipsisFrom={isColumns && xsm ? 4 : undefined}
        />
        <PayloadStatus
          payload={payload}
          isFinalStatus={isFinalStatus}
          isPayloadOnInitialState={isPayloadOnInitialState}
          isPayloadReadyForExecution={isPayloadReadyForExecution}
          isExecuted={isExecuted}
          payloadExecutionTime={payloadExecutionTime}
          payloadExpiredTime={payloadExpiredTime}
          titleTypography={isColumns && xsm ? 'descriptorAccent' : 'headline'}
          textTypography={isColumns && xsm ? 'descriptor' : 'body'}
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
          <Box
            sx={{
              typography: isColumns && xsm ? 'headline' : 'h2',
              [theme.breakpoints.up('sm')]: {
                mb: isColumns ? 0 : 12,
                mt: isColumns ? 16 : 0,
              },
            }}>
            {texts.proposals.payloadsDetails.actions(
              payload.actions?.length || 0,
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
          alignItems: 'center',
          justifyContent: 'space-between',
          [theme.breakpoints.up('xsm')]: {
            flexDirection: isColumns ? 'column-reverse' : 'row-reverse',
            alignItems: isColumns ? 'flex-start' : 'center',
            justifyContent: isColumns ? 'space-between' : 'space-between',
          },
          [theme.breakpoints.up('sm')]: {
            flexDirection: isColumns ? 'row-reverse' : 'column',
            alignItems: isColumns ? 'center' : 'flex-end',
            justifyContent: isColumns ? 'space-between' : 'flex-end',
            mt: isColumns ? 18 : 0,
            width: isColumns ? '100%' : 'auto',
          },
          [theme.breakpoints.up('md')]: {
            flex: 1,
          },
          [theme.breakpoints.up('lg')]: {
            mt: isColumns ? 24 : 0,
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
            [theme.breakpoints.up('xsm')]: {
              order: 0,
              mt: isColumns ? 12 : 0,
            },
            [theme.breakpoints.up('sm')]: {
              order: 0,
              mt: 0,
              mb: isColumns ? 0 : 12,
            },
            [theme.breakpoints.up('lg')]: {
              minWidth: 102,
            },
          }}>
          {statusText}
        </Box>

        <Box>
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

          {isPayloadReadyForExecution &&
            !isFinalStatus &&
            activeWallet?.isActive && (
              <Box sx={{ mt: 4 }}>
                <SmallButton
                  disabled={tx?.status === TransactionStatus.Success}
                  loading={tx?.pending}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!!setSelectedPayloadForExecute) {
                      setSelectedPayloadForExecute({
                        chainId: payload.chainId,
                        payloadsController:
                          payload.payloadsController as Address,
                        id: payload.id,
                      });
                    }
                    setExecutePayloadModalOpen(true);
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
