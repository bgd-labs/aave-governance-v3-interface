import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { ReactNode, useEffect, useState } from 'react';

import ArrowToBottom from '/public/images/icons/arrowToBottom.svg';
import ArrowToTop from '/public/images/icons/arrowToTop.svg';
import CopyIcon from '/public/images/icons/copy.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';

import {
  InitialPayload,
  Payload,
  PayloadState,
} from '../../../../lib/helpers/src';
import { selectLastTxByTypeAndPayload } from '../../../../lib/web3/src';
import { useStore } from '../../../store';
import { TransactionUnion } from '../../../transactions/store/transactionsSlice';
import {
  BoxWith3D,
  CopyToClipboard,
  Link,
  SmallButton,
  Timer,
} from '../../../ui';
import { NetworkIcon } from '../../../ui/components/NetworkIcon';
import { IconBox } from '../../../ui/primitives/IconBox';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';

interface ProposalPayloadsProps {
  proposalId: number;
  isProposalExecuted: boolean;
  payloads: Payload[];
  setSelectedPayloadForExecute: (payload: InitialPayload | undefined) => void;
}

function PayloadItemStatusInfo({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}>
      {title && (
        <Box sx={{ typography: 'descriptorAccent', mb: 2 }}>{title}</Box>
      )}
      <Box sx={{ typography: 'descriptor' }}>{children}</Box>
    </Box>
  );
}

function PayloadItem({
  proposalId,
  payload,
  isProposalExecuted,
  payloadCount,
  totalPayloadsCount,
  isFullView,
  inList,
  setSelectedPayloadForExecute,
}: Pick<
  ProposalPayloadsProps,
  'setSelectedPayloadForExecute' | 'isProposalExecuted' | 'proposalId'
> & {
  payload: Payload;
  payloadCount: number;
  totalPayloadsCount: number;
  isFullView?: boolean;
  inList?: boolean;
}) {
  const theme = useTheme();
  const store = useStore();
  const now = dayjs().unix();

  const [isActionsOpen, setIsActionsOpen] = useState(false);

  useEffect(() => {
    setIsActionsOpen(false);
  }, [isFullView]);

  const isPayloadOnInitialState =
    payload.queuedAt <= 0 &&
    !isProposalExecuted &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const payloadExecutionTime = payload.queuedAt + payload.delay;
  const isPayloadReadyForExecution =
    isProposalExecuted &&
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

  let payloadNumber =
    totalPayloadsCount > 1 ? `${payloadCount}/${totalPayloadsCount}` : '';

  const isActionVisible = totalPayloadsCount > 1 ? isActionsOpen : isFullView;
  const isArrowVisibleForFirstPayload = totalPayloadsCount > 1 && isFullView;
  const isFinalStatus =
    isExecuted ||
    payload.cancelledAt > 0 ||
    payload.state === PayloadState.Expired;

  const tx = selectLastTxByTypeAndPayload<TransactionUnion>(
    store,
    store.activeWallet?.accounts[0] || '',
    'executePayload',
    {
      proposalId,
      payloadId: payload.id,
      chainId: payload.chainId,
    },
  );

  return (
    <Box
      sx={{
        mb: isFullView || inList ? 10 : 0,
        '&:last-of-type': {
          mb: 0,
        },
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
        <Box
          onClick={() => {
            if (isArrowVisibleForFirstPayload || inList) {
              setIsActionsOpen(!isActionsOpen);
            }
          }}
          sx={{
            cursor:
              isArrowVisibleForFirstPayload || inList ? 'pointer' : 'default',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
          <NetworkIcon chainId={payload.chainId} size={10} css={{ mr: 4 }} />
          <Box sx={{ typography: 'body' }}>
            {texts.proposals.payloadsDetails.payload} {payloadNumber}
          </Box>
          {(isArrowVisibleForFirstPayload || inList) && (
            <IconBox
              sx={{
                width: 10,
                height: 10,
                ml: 4,
                '> svg': { width: 10, height: 10 },
                path: { stroke: theme.palette.$main },
              }}>
              {isActionsOpen ? <ArrowToTop /> : <ArrowToBottom />}
            </IconBox>
          )}
        </Box>

        <Box>
          {isPayloadOnInitialState && (
            <PayloadItemStatusInfo
              title={texts.proposals.payloadsDetails.created}>
              <>{dayjs.unix(payload.createdAt).format('MMM D, YYYY, h:mm')}</>
            </PayloadItemStatusInfo>
          )}
          {!isPayloadOnInitialState && !isPayloadReadyForExecution && (
            <PayloadItemStatusInfo
              title={texts.proposals.payloadsDetails.executedIn}>
              <Timer timestamp={payloadExecutionTime} />
            </PayloadItemStatusInfo>
          )}

          {isPayloadReadyForExecution && !isExecuted && (
            <>
              {store.activeWallet?.isActive ? (
                <SmallButton
                  disabled={tx?.status === 1}
                  loading={tx?.pending}
                  onClick={() => {
                    setSelectedPayloadForExecute({
                      chainId: payload.chainId,
                      payloadsController: payload.payloadsController,
                      id: payload.id,
                    });
                    store.setExecutePayloadModalOpen(true);
                  }}>
                  {texts.proposals.payloadsDetails.execute}
                </SmallButton>
              ) : (
                <PayloadItemStatusInfo>
                  {texts.proposals.payloadsDetails.execution}
                </PayloadItemStatusInfo>
              )}
            </>
          )}

          {isExecuted && (
            <PayloadItemStatusInfo
              title={texts.proposals.payloadsDetails.executedAt}>
              <>
                {dayjs.unix(payload.executedAt).format('MMM D, YYYY, , h:mm')}
              </>
            </PayloadItemStatusInfo>
          )}

          {payload.cancelledAt > 0 && (
            <PayloadItemStatusInfo
              title={texts.proposals.payloadsDetails.cancelledAt}>
              <>
                {dayjs.unix(payload.cancelledAt).format('MMM D, YYYY, , h:mm')}
              </>
            </PayloadItemStatusInfo>
          )}

          {payload.state === PayloadState.Expired && (
            <PayloadItemStatusInfo>
              {texts.proposals.payloadsDetails.expired}
            </PayloadItemStatusInfo>
          )}
        </Box>
      </Box>

      {(isActionVisible || isActionsOpen) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mt: 2,
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ typography: 'descriptorAccent' }}>
              {texts.proposals.payloadsDetails.actions(
                payload.actionAddresses.length,
              )}
            </Box>
            <Box
              component="ul"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                listStyleType: 'disc',
                pl: 12,
              }}>
              {payload.actionAddresses.map((address, index) => (
                <Box
                  sx={{ display: 'inline-flex', alignItems: 'center' }}
                  key={index}>
                  <Link
                    css={{ display: 'inline-flex', alignItems: 'center' }}
                    inNewWindow
                    href={`${
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      chainInfoHelper.getChainParameters(
                        payload.chainId || appConfig.govCoreChainId,
                      ).blockExplorerUrls[0]
                    }address/${address}`}>
                    <Box
                      component="li"
                      sx={{
                        mb: 2,
                        typography: 'descriptor',
                        transition: 'all 0.2s ease',
                        '&:last-of-type': {
                          mb: 0,
                        },
                        hover: { opacity: 0.7 },
                      }}>
                      {textCenterEllipsis(address, 6, 6)}
                    </Box>

                    <IconBox
                      sx={{
                        width: 10,
                        height: 10,
                        ml: 2,
                        '> svg': {
                          width: 10,
                          height: 10,
                          path: {
                            '&:first-of-type': {
                              stroke: theme.palette.$text,
                            },
                            '&:last-of-type': {
                              fill: theme.palette.$text,
                            },
                          },
                        },
                      }}>
                      <LinkIcon />
                    </IconBox>
                  </Link>

                  <CopyToClipboard copyText={address}>
                    <IconBox
                      sx={{
                        cursor: 'pointer',
                        width: 10,
                        height: 10,
                        '> svg': {
                          width: 10,
                          height: 10,
                        },
                        ml: 3,
                        path: {
                          transition: 'all 0.2s ease',
                          stroke: theme.palette.$textSecondary,
                        },
                        hover: { path: { stroke: theme.palette.$main } },
                      }}>
                      <CopyIcon />
                    </IconBox>
                  </CopyToClipboard>
                </Box>
              ))}
            </Box>
          </Box>

          {!isFinalStatus && (
            <Box
              sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}>
              <Box sx={{ typography: 'descriptorAccent' }}>
                {texts.proposals.payloadsDetails.expiredIn}
              </Box>
              <Box sx={{ typography: 'descriptor' }}>
                <Timer timestamp={payloadExpiredTime} />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export function ProposalPayloads({
  proposalId,
  isProposalExecuted,
  payloads,
  setSelectedPayloadForExecute,
}: ProposalPayloadsProps) {
  const theme = useTheme();

  const [isFullView, setFullView] = useState(false);

  const formattedPayloadsForList: Payload[] =
    !!payloads.length && payloads.length > 1
      ? payloads.slice(1, payloads.length)
      : [];

  return (
    <BoxWith3D
      borderSize={10}
      contentColor="$mainLight"
      bottomBorderColor="$light"
      wrapperCss={{ mb: 12 }}
      css={{ p: '15px 0 15px 20px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 10,
          pr: 20,
        }}>
        <Box sx={{ typography: 'headline' }}>
          {texts.proposals.payloadsDetails.payload}
        </Box>
        <Box sx={{ typography: 'headline' }}>
          {texts.proposals.payloadsDetails.details}
        </Box>
      </Box>

      <Box
        sx={(theme) => ({
          pr: 20,
          maxHeight: payloads.length > 2 ? 200 : 'unset',
          overflowY: payloads.length > 2 ? 'auto' : undefined,
          [theme.breakpoints.up('lg')]: {
            maxHeight: payloads.length > 2 ? 300 : 'unset',
          },
        })}>
        <PayloadItem
          proposalId={proposalId}
          payload={payloads[0]}
          payloadCount={1}
          totalPayloadsCount={payloads.length}
          isProposalExecuted={isProposalExecuted}
          isFullView={isFullView}
          setSelectedPayloadForExecute={setSelectedPayloadForExecute}
        />

        {!!formattedPayloadsForList.length && isFullView && (
          <>
            {formattedPayloadsForList.map((payload, index) => (
              <PayloadItem
                proposalId={proposalId}
                key={`${payload.id}_${payload.chainId}`}
                payload={payload}
                isProposalExecuted={isProposalExecuted}
                payloadCount={index + 2}
                totalPayloadsCount={payloads.length}
                isFullView={false}
                inList
                setSelectedPayloadForExecute={setSelectedPayloadForExecute}
              />
            ))}
          </>
        )}
      </Box>

      <Box
        sx={{
          mt: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pr: 20,
        }}>
        <Box
          onClick={() => setFullView(!isFullView)}
          sx={{
            cursor: 'pointer',
            typography: 'descriptorAccent',
            color: '$textSecondary',
            transition: 'all 0.2s ease',
            hover: { color: theme.palette.$text },
          }}>
          {texts.proposals.payloadsDetails.more(isFullView)}
        </Box>
      </Box>
    </BoxWith3D>
  );
}
