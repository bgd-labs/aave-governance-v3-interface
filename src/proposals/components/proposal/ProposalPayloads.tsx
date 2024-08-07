import {
  InitialPayload,
  PayloadState,
} from '@bgd-labs/aave-governance-ui-helpers';
import {
  selectLastTxByTypeAndPayload,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { ReactNode, useEffect, useState } from 'react';
import { Hex, zeroHash } from 'viem';

import ArrowToBottom from '/public/images/icons/arrowToBottom.svg';
import ArrowToTop from '/public/images/icons/arrowToTop.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';

import { SeatBeltReportModal } from '../../../proposalCreateOverview/components/SeatBeltReportModal';
import { NewPayload } from '../../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { useStore } from '../../../store/ZustandStoreProvider';
import {
  TransactionUnion,
  TxType,
} from '../../../transactions/store/transactionsSlice';
import { BoxWith3D, Link, SmallButton, Timer } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { NetworkIcon } from '../../../ui/components/NetworkIcon';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import { getScanLink } from '../../../utils/getScanLink';
import {
  formatPayloadData,
  generateSeatbeltLink,
} from '../../utils/formatPayloadData';
import { PayloadActions } from './PayloadActions';
import { PayloadCreator } from './PayloadCreator';

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
  isSecondary,
  titleTypography,
  textTypography,
}: {
  title?: string;
  children: ReactNode;
  isSecondary?: boolean;
  titleTypography?: string;
  textTypography?: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        color: isSecondary ? '$textSecondary' : '$text',
      }}>
      {title && (
        <Box sx={{ typography: titleTypography || 'descriptorAccent', mr: 6 }}>
          {title}
        </Box>
      )}
      <Box sx={{ typography: textTypography || 'descriptor' }}>{children}</Box>
    </Box>
  );
}

export function PayloadError({ payload }: { payload: NewPayload }) {
  return (
    <Box>
      <Box sx={{ wordBreak: 'break-word' }}>
        Cannot get payload id {payload.id}
        <br />
        <br />
        payloadController:{' '}
        <Link
          css={{ display: 'inline-block' }}
          href={getScanLink({
            chainId: payload.chainId,
            address: payload.payloadsController,
          })}
          inNewWindow>
          {payload.payloadsController}
        </Link>
      </Box>
    </Box>
  );
}

function PayloadStatusWithHash({
  payload,
  txHash,
  children,
}: {
  payload: NewPayload;
  txHash?: string;
  children: ReactNode;
}) {
  return (
    <>
      {!!txHash && txHash !== zeroHash ? (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Link
            inNewWindow
            href={getScanLink({
              chainId: payload.chainId,
              address: txHash,
              type: 'tx',
            })}>
            {children}
          </Link>
          <CopyAndExternalIconsSet
            iconSize={12}
            externalLink={getScanLink({
              chainId: payload.chainId,
              address: txHash,
              type: 'tx',
            })}
            sx={{ '.CopyAndExternalIconsSet__link': { ml: 4 } }}
          />
        </Box>
      ) : (
        children
      )}
    </>
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
  payload: NewPayload;
  payloadCount: number;
  totalPayloadsCount: number;
  isFullView?: boolean;
  inList?: boolean;
}) {
  const theme = useTheme();

  const transactionsPool = useStore((store) => store.transactionsPool);
  const activeWallet = useStore((store) => store.activeWallet);
  const setExecutePayloadModalOpen = useStore(
    (store) => store.setExecutePayloadModalOpen,
  );
  const payloadsHelperData = useStore((store) => store.payloadsHelperData);
  const getPayloadSeatbeltMD = useStore((store) => store.getPayloadSeatbeltMD);
  const proposalHistory = useStore((store) => store.proposalHistory);

  const [isActionsOpen, setIsActionsOpen] = useState(!!forCreate);
  const [isSeatbeltModalOpen, setIsSeatbeltModalOpen] = useState(false);
  const [finalReport, setFinalReport] = useState(report);

  useEffect(() => {
    if (!report) {
      const reportFromStore =
        payloadsHelperData[`${payload.payloadsController}_${payload.id}`]
          ?.seatbeltMD;
      if (reportFromStore) {
        setFinalReport(reportFromStore);
      } else {
        getPayloadSeatbeltMD(payload);
        const reportFromStoreNew =
          payloadsHelperData[`${payload.payloadsController}_${payload.id}`]
            ?.seatbeltMD;
        setFinalReport(reportFromStoreNew);
      }
    }
  }, [
    report,
    payloadsHelperData[`${payload.payloadsController}_${payload.id}`],
  ]);

  useEffect(() => {
    if (forCreate) {
      setIsActionsOpen(true);
    } else {
      setIsActionsOpen(false);
    }
  }, [isFullView]);

  const {
    isPayloadOnInitialState,
    isPayloadTimeLocked,
    payloadExecutionTime,
    isPayloadReadyForExecution,
    isExecuted,
    payloadExpiredTime,
    payloadNumber,
    isFinalStatus,
    txHash,
  } = formatPayloadData({
    payload,
    payloadCount,
    totalPayloadsCount,
    forCreate,
    isProposalExecuted,
    proposalQueuingTime,
    proposalId,
    proposalHistory,
  });

  const isActionVisible = totalPayloadsCount > 1 ? isActionsOpen : isFullView;
  const isArrowVisibleForFirstPayload = totalPayloadsCount > 1 && isFullView;

  const tx =
    activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      transactionsPool,
      activeWallet.address,
      TxType.executePayload,
      {
        proposalId,
        payloadId: payload.id,
        chainId: payload.chainId,
      },
    );

  return (
    <>
      {!!finalReport && (
        <SeatBeltReportModal
          isOpen={isSeatbeltModalOpen}
          setIsOpen={setIsSeatbeltModalOpen}
          report={finalReport}
          link={generateSeatbeltLink(payload)}
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
            if ((isArrowVisibleForFirstPayload || inList) && !forCreate) {
              setIsActionsOpen(!isActionsOpen);
            }
          }}
          sx={{
            px: 6,
            pb: 4,
            cursor:
              (isArrowVisibleForFirstPayload || inList) && !forCreate
                ? 'pointer'
                : 'default',
            transition: 'all 0.2s ease',
            hover: {
              backgroundColor:
                (isArrowVisibleForFirstPayload || inList) && !forCreate
                  ? theme.palette.$light
                  : undefined,
            },
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 24,
            }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
              }}>
              <NetworkIcon
                chainId={payload.chainId}
                size={14}
                css={{ mr: 4 }}
                withTooltip={forCreate}
              />
              <Box sx={{ typography: 'body' }}>
                {texts.proposals.payloadsDetails.payload} {payloadNumber}
              </Box>
              <CopyAndExternalIconsSet
                iconSize={12}
                externalLink={`https://vote.onaave.com/payloads-explorer/?payloadId=${payload.id}&payloadChainId=${payload.chainId}&payloadsControllerAddress=${payload.payloadsController}`}
                sx={{ '.CopyAndExternalIconsSet__link': { ml: 4 } }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isPayloadReadyForExecution && !isExecuted && (
                <>
                  {activeWallet?.isActive ? (
                    <SmallButton
                      disabled={tx?.status === TransactionStatus.Success}
                      loading={tx?.pending}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (setSelectedPayloadForExecute) {
                          setSelectedPayloadForExecute({
                            chainId: payload.chainId,
                            payloadsController: payload.payloadsController,
                            id: payload.id,
                          });
                        }
                        setExecutePayloadModalOpen(true);
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
              {(isArrowVisibleForFirstPayload || inList) && !forCreate && (
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

          <Box sx={{ pl: 18, mt: 4 }}>
            {forCreate &&
              (!!payload.proposalId || payload.proposalId === 0) && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    typography: 'descriptorAccent',
                  }}>
                  Proposal id: {payload.proposalId}{' '}
                  <CopyAndExternalIconsSet
                    externalLink={`/proposal?proposalId=${payload.proposalId}`}
                    iconSize={12}
                    sx={{ '.CopyAndExternalIconsSet__link': { ml: 4 } }}
                  />
                </Box>
              )}

            {forCreate && (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
                  <Box sx={{ typography: 'descriptorAccent' }}>
                    {texts.proposals.payloadsDetails.accessLevel}:{' '}
                    <Box sx={{ display: 'inline', typography: 'headline' }}>
                      {payload.maximumAccessLevelRequired}
                    </Box>
                  </Box>
                </Box>
              </>
            )}

            {isPayloadOnInitialState && (
              <PayloadItemStatusInfo
                title={texts.proposals.payloadsDetails.created}>
                <>
                  {createTransactionHash ? (
                    <Link
                      css={{ display: 'inline-flex', alignItems: 'center' }}
                      inNewWindow
                      href={getScanLink({
                        chainId: payload.chainId,
                        address: createTransactionHash,
                        type: 'tx',
                      })}>
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
                    <PayloadStatusWithHash
                      txHash={txHash}
                      payload={payload}
                      children={dayjs
                        .unix(payload.createdAt)
                        .format('MMM D, YYYY, h:mm A')}
                    />
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
                <PayloadStatusWithHash
                  txHash={txHash}
                  payload={payload}
                  children={dayjs
                    .unix(payload.executedAt)
                    .format('MMM D, YYYY, h:mm A')}
                />
              </PayloadItemStatusInfo>
            )}

            {payload.cancelledAt > 0 && (
              <PayloadItemStatusInfo
                title={texts.proposals.payloadsDetails.cancelledAt}>
                <>
                  {dayjs
                    .unix(payload.cancelledAt)
                    .format('MMM D, YYYY, h:mm A')}
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
                    .format('MMM D, YYYY, h:mm A')}
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
              pl: 24,
            }}>
            {!isFinalStatus && (
              <Box sx={{ mb: 4 }}>
                <PayloadItemStatusInfo
                  isSecondary
                  title={texts.proposals.payloadsDetails.expiredIn}>
                  <Box sx={{ typography: 'descriptor' }}>
                    <Timer timestamp={payloadExpiredTime} />
                  </Box>
                </PayloadItemStatusInfo>
              </Box>
            )}

            {creator && (
              <PayloadCreator
                payload={payload}
                ellipsisFrom={12}
                sx={{ color: '$textSecondary', a: { color: '$textSecondary' } }}
              />
            )}

            <PayloadActions
              payload={payload}
              forCreate={forCreate}
              withLink
              setIsSeatbeltModalOpen={setIsSeatbeltModalOpen}
              report={finalReport}
            />
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

  const createPayloadsErrors = useStore((store) => store.createPayloadsErrors);

  const [isFullView, setFullView] = useState(!!forCreate);

  const formattedPayloadsForList: NewPayload[] =
    !!payloads.length && payloads.length > 1
      ? payloads.slice(1, payloads.length)
      : [];

  const isFirstPayloadError =
    createPayloadsErrors[`${payloads[0].payloadsController}_${proposalId}`];

  return (
    <BoxWith3D
      borderSize={10}
      contentColor="$mainLight"
      bottomBorderColor="$light"
      wrapperCss={{ mb: 18, [theme.breakpoints.up('lg')]: { mb: 24 } }}
      css={{
        p: '18px 0 18px 12px',
        [theme.breakpoints.up('lg')]: {
          p: '24px 0 24px 24px',
        },
      }}>
      <Box
        sx={(theme) => ({
          pr: 12,
          maxHeight: payloads.length > 2 && !forCreate ? 200 : 'unset',
          overflowY: payloads.length > 2 && !forCreate ? 'auto' : undefined,
          [theme.breakpoints.up('lg')]: {
            maxHeight: payloads.length > 2 && !forCreate ? 300 : 'unset',
            pr: 24,
          },
        })}>
        {isFirstPayloadError ? (
          <PayloadError payload={payloads[0]} />
        ) : (
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
        )}

        {!!formattedPayloadsForList.length && isFullView && (
          <>
            {formattedPayloadsForList.map((payload, index) => {
              const isError =
                createPayloadsErrors[
                  `${payload.payloadsController}_${proposalId}`
                ];

              if (isError) {
                return <PayloadError payload={payload} />;
              } else {
                return (
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
                );
              }
            })}
          </>
        )}
      </Box>

      {!forCreate && (
        <Box
          sx={{
            mt: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pr: 12,
            [theme.breakpoints.up('lg')]: {
              pr: 24,
            },
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
