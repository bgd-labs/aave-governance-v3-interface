import {
  InitialPayload,
  Payload,
  PayloadState,
} from '@bgd-labs/aave-governance-ui-helpers';
import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { ReactNode, useEffect, useState } from 'react';
import { Hex } from 'viem';

import ArrowToBottom from '/public/images/icons/arrowToBottom.svg';
import ArrowToTop from '/public/images/icons/arrowToTop.svg';
import CopyIcon from '/public/images/icons/copy.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';

import { SeatBeltReportModal } from '../../../proposalCreateOverview/components/SeatBeltReportModal';
import { NewPayload } from '../../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { useStore } from '../../../store';
import {
  TransactionUnion,
  TxType,
} from '../../../transactions/store/transactionsSlice';
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
  proposalQueuingTime: number;
  isProposalExecuted: boolean;
  payloads: NewPayload[];
  setSelectedPayloadForExecute?: (payload: InitialPayload | undefined) => void;
  forCreate?: boolean;
}

export function PayloadItemStatusInfo({
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
        flexDirection: 'row',
        alignItems: 'flex-end',
        my: 4,
      }}>
      {title && (
        <Box sx={{ typography: 'descriptorAccent', mr: 6 }}>{title}</Box>
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
  proposalQueuingTime,
  isFullView,
  inList,
  setSelectedPayloadForExecute,
  creator,
  forCreate,
  createTransactionHash,
  report,
}: Pick<
  ProposalPayloadsProps,
  | 'setSelectedPayloadForExecute'
  | 'isProposalExecuted'
  | 'proposalId'
  | 'proposalQueuingTime'
  | 'forCreate'
> & {
  creator?: Hex;
  createTransactionHash?: string;
  report?: string;
  payload: Payload;
  payloadCount: number;
  totalPayloadsCount: number;
  isFullView?: boolean;
  inList?: boolean;
}) {
  const theme = useTheme();
  const store = useStore();
  const now = dayjs().unix();

  const [isActionsOpen, setIsActionsOpen] = useState(!!forCreate);
  const [isSeatbeltModalOpen, setIsSeatbeltModalOpen] = useState(false);

  useEffect(() => {
    if (forCreate) {
      setIsActionsOpen(true);
    } else {
      setIsActionsOpen(false);
    }
  }, [isFullView]);

  const isPayloadOnInitialState =
    payload.queuedAt <= 0 &&
    !isProposalExecuted &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const isPayloadTimeLocked =
    payload.queuedAt <= 0 &&
    isProposalExecuted &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const payloadExecutionTime =
    payload.queuedAt <= 0
      ? proposalQueuingTime + payload.delay
      : payload.queuedAt + payload.delay;

  const isPayloadReadyForExecution =
    isProposalExecuted &&
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

  let payloadNumber = forCreate
    ? `id #${payload.id}`
    : totalPayloadsCount > 1
      ? `${payloadCount}/${totalPayloadsCount}`
      : '';

  const isActionVisible = totalPayloadsCount > 1 ? isActionsOpen : isFullView;
  const isArrowVisibleForFirstPayload = totalPayloadsCount > 1 && isFullView;
  const isFinalStatus =
    isExecuted ||
    payload.cancelledAt > 0 ||
    payload.state === PayloadState.Expired;

  const tx =
    store.activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      store,
      store.activeWallet.address,
      TxType.executePayload,
      {
        proposalId,
        payloadId: payload.id,
        chainId: payload.chainId,
      },
    );

  return (
    <>
      {!!report && (
        <SeatBeltReportModal
          isOpen={isSeatbeltModalOpen}
          setIsOpen={setIsSeatbeltModalOpen}
          report={report}
        />
      )}

      <Box
        sx={{
          mb: isFullView || inList ? 18 : 0,
          '&:last-of-type': {
            mb: 0,
          },
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
            transition: 'all 0.2s ease',
            hover: {
              backgroundColor:
                isArrowVisibleForFirstPayload || inList
                  ? theme.palette.$light
                  : undefined,
            },
          }}>
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
              }}>
              <NetworkIcon
                chainId={payload.chainId}
                size={10}
                css={{ mr: 4 }}
                withTooltip={forCreate}
              />
              <Box sx={{ typography: 'body' }}>
                {texts.proposals.payloadsDetails.payload} {payloadNumber}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!!report && forCreate && (
                <SmallButton
                  disabled={tx?.status === TransactionStatus.Success}
                  loading={tx?.pending}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSeatbeltModalOpen(true);
                  }}>
                  {texts.proposals.payloadsDetails.seatbelt}
                </SmallButton>
              )}

              {isPayloadReadyForExecution && !isExecuted && (
                <>
                  {store.activeWallet?.isActive ? (
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
                  ) : (
                    <PayloadItemStatusInfo>
                      {texts.proposals.payloadsDetails.execution}
                    </PayloadItemStatusInfo>
                  )}
                </>
              )}
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
          </Box>

          <Box>
            {forCreate && (
              <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
                <Box sx={{ typography: 'descriptorAccent' }}>
                  {texts.proposals.payloadsDetails.accessLevel}:{' '}
                  <Box sx={{ display: 'inline', typography: 'headline' }}>
                    {payload.maximumAccessLevelRequired}
                  </Box>
                </Box>
              </Box>
            )}

            {isPayloadOnInitialState && (
              <PayloadItemStatusInfo
                title={texts.proposals.payloadsDetails.created}>
                <>
                  {createTransactionHash ? (
                    <Link
                      css={{ display: 'inline-flex', alignItems: 'center' }}
                      inNewWindow
                      href={`${chainInfoHelper.getChainParameters(
                        payload.chainId || appConfig.govCoreChainId,
                      ).blockExplorers?.default
                        .url}/tx/${createTransactionHash}`}>
                      {dayjs
                        .unix(payload.createdAt)
                        .format('MMM D, YYYY, h:mm A')}
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
                  ) : (
                    dayjs.unix(payload.createdAt).format('MMM D, YYYY, h:mm A')
                  )}
                </>
              </PayloadItemStatusInfo>
            )}

            {!isPayloadOnInitialState &&
              isPayloadTimeLocked &&
              !isFinalStatus &&
              !isPayloadReadyForExecution && (
                <PayloadItemStatusInfo>
                  {texts.proposals.payloadsDetails.timeLocked}
                </PayloadItemStatusInfo>
              )}

            {!isPayloadOnInitialState &&
              !isPayloadReadyForExecution &&
              !isPayloadTimeLocked &&
              !isFinalStatus && (
                <PayloadItemStatusInfo
                  title={texts.proposals.payloadsDetails.executedIn}>
                  <Timer timestamp={payloadExecutionTime} />
                </PayloadItemStatusInfo>
              )}

            {isExecuted && (
              <PayloadItemStatusInfo
                title={texts.proposals.payloadsDetails.executedAt}>
                <>
                  {dayjs
                    .unix(payload.executedAt)
                    .format('MMM D, YYYY, , h:mm A')}
                </>
              </PayloadItemStatusInfo>
            )}

            {payload.cancelledAt > 0 && (
              <PayloadItemStatusInfo
                title={texts.proposals.payloadsDetails.cancelledAt}>
                <>
                  {dayjs
                    .unix(payload.cancelledAt)
                    .format('MMM D, YYYY, , h:mm A')}
                </>
              </PayloadItemStatusInfo>
            )}

            {payload.state === PayloadState.Expired && (
              <PayloadItemStatusInfo
                title={texts.proposals.payloadsDetails.expired}>
                <>
                  {dayjs
                    .unix(
                      payload.queuedAt <= 0
                        ? payload.expirationTime
                        : payload.queuedAt +
                            payload.delay +
                            payload.gracePeriod,
                    )
                    .format('MMM D, YYYY, , h:mm A')}
                </>
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
              flexDirection: 'column',
              mt: 4,
            }}>
            {creator && (
              <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
                <Box
                  sx={{
                    typography: 'descriptorAccent',
                    wordBreak: 'break-word',
                  }}>
                  {texts.proposals.payloadsDetails.creator}:{' '}
                  <Box sx={{ typography: 'descriptor' }}>
                    <Link
                      css={{ display: 'inline-flex', alignItems: 'center' }}
                      inNewWindow
                      href={`${chainInfoHelper.getChainParameters(
                        payload.chainId || appConfig.govCoreChainId,
                      ).blockExplorers?.default.url}/address/${creator}`}>
                      {textCenterEllipsis(creator, 15, 10)}
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
                  </Box>
                </Box>
              </Box>
            )}

            {!isFinalStatus && (
              <PayloadItemStatusInfo
                title={texts.proposals.payloadsDetails.expiredIn}>
                <Box sx={{ typography: 'descriptor' }}>
                  <Timer timestamp={payloadExpiredTime} />
                </Box>
              </PayloadItemStatusInfo>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ typography: 'descriptorAccent' }}>
                {texts.proposals.payloadsDetails.actions(
                  payload.actionAddresses?.length || 0,
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
                {payload.actionAddresses?.map((address, index) => (
                  <Box
                    sx={{ display: 'inline-flex', alignItems: 'center', mt: 3 }}
                    key={index}>
                    <Link
                      css={{ display: 'inline-flex', alignItems: 'center' }}
                      inNewWindow
                      href={`${chainInfoHelper.getChainParameters(
                        payload.chainId || appConfig.govCoreChainId,
                      ).blockExplorers?.default.url}/address/${address}${
                        forCreate ? '#code' : ''
                      }`}>
                      <Box
                        component="li"
                        sx={{
                          typography: 'descriptor',
                          transition: 'all 0.2s ease',
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
          </Box>
        )}
      </Box>
    </>
  );
}

export function ProposalPayloads({
  proposalId,
  isProposalExecuted,
  payloads,
  setSelectedPayloadForExecute,
  proposalQueuingTime,
  forCreate,
}: ProposalPayloadsProps) {
  const theme = useTheme();

  const [isFullView, setFullView] = useState(!!forCreate);

  const formattedPayloadsForList: NewPayload[] =
    !!payloads.length && payloads.length > 1
      ? payloads.slice(1, payloads.length)
      : [];

  return (
    <BoxWith3D
      borderSize={10}
      contentColor="$mainLight"
      bottomBorderColor="$light"
      wrapperCss={{ mb: 12 }}
      css={{
        p: '20px 0 20px 20px',
        [theme.breakpoints.up('lg')]: { p: '24px 0 24px 30px' },
      }}>
      <Box
        sx={(theme) => ({
          pr: 20,
          maxHeight: payloads.length > 2 ? 200 : 'unset',
          overflowY: payloads.length > 2 ? 'auto' : undefined,
          [theme.breakpoints.up('lg')]: {
            maxHeight: payloads.length > 2 ? 300 : 'unset',
            pr: 30,
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
          proposalQueuingTime={proposalQueuingTime}
          forCreate={forCreate}
          creator={payloads[0].creator || undefined}
          createTransactionHash={payloads[0].transactionHash || undefined}
          report={payloads[0].seatbeltMD || undefined}
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
                proposalQueuingTime={proposalQueuingTime}
                forCreate={forCreate}
                creator={payload.creator || undefined}
                createTransactionHash={payload.transactionHash || undefined}
                report={payload.seatbeltMD || undefined}
              />
            ))}
          </>
        )}
      </Box>

      {!forCreate && (
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
      )}
    </BoxWith3D>
  );
}
