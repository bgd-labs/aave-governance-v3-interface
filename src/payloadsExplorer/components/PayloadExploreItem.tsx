import { Payload, PayloadState } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';
import { toHex } from 'viem';

import CopyIcon from '/public/images/icons/copy.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';

import { PayloadItemStatusInfo } from '../../proposals/components/proposal/ProposalPayloads';
import { BoxWith3D, CopyToClipboard, Link, SmallButton, Timer } from '../../ui';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { IconBox } from '../../ui/primitives/IconBox';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';

export function PayloadExploreItem({ payload }: { payload: Payload }) {
  const theme = useTheme();
  const now = dayjs().unix();

  const isPayloadOnInitialState =
    payload.queuedAt <= 0 &&
    payload.cancelledAt <= 0 &&
    payload.state !== PayloadState.Expired;

  const payloadExecutionTime =
    payload.queuedAt <= 0
      ? now + payload.delay
      : payload.queuedAt + payload.delay;

  const isPayloadReadyForExecution =
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

  const payloadNumber = `id #${payload.id}`;
  const isFinalStatus =
    isExecuted ||
    payload.cancelledAt > 0 ||
    payload.state === PayloadState.Expired;

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

  return (
    <BoxWith3D
      contentColor="$mainLight"
      wrapperCss={{
        height: '100%',
        '> div, .BoxWith3D__content': { height: '100%' },
      }}
      css={{
        p: 8,
        height: '100%',
        position: 'relative',
        flexWrap: 'wrap',
        [theme.breakpoints.up('sm')]: { p: 12 },
      }}>
      <Box>
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
              size={14}
              css={{ mr: 4 }}
              withTooltip={true}
            />
            <Box sx={{ typography: 'body' }}>
              {texts.proposals.payloadsDetails.payload} <b>{payloadNumber}</b>
            </Box>
          </Box>

          <Link
            href={`https://github.com/bgd-labs/seatbelt-gov-v3/blob/main/reports/payloads//${payload.chainId}/${payload.payloadsController}/${payload.id}.md`}
            inNewWindow
            css={{ display: 'flex', alignItems: 'center' }}>
            <SmallButton
              onClick={(e) => {
                e.stopPropagation();
              }}>
              {texts.proposals.payloadsDetails.seatbelt}
            </SmallButton>
          </Link>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
            <Box sx={{ typography: 'descriptorAccent' }}>
              Payload id (Hex):{' '}
              <Box
                sx={{
                  display: 'inline',
                  typography: 'headline',
                }}>
                {toHex(payload.id)}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
            <Box sx={{ typography: 'descriptorAccent' }}>
              {texts.proposals.payloadsDetails.accessLevel}:{' '}
              <Box sx={{ display: 'inline', typography: 'headline' }}>
                {payload.maximumAccessLevelRequired}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
            <Box
              sx={{ typography: 'descriptorAccent', wordBreak: 'break-word' }}>
              {texts.proposals.payloadsDetails.creator}:{' '}
              <Box sx={{ typography: 'descriptor' }}>
                <Link
                  css={{ display: 'inline-flex', alignItems: 'center' }}
                  inNewWindow
                  href={`${chainInfoHelper.getChainParameters(
                    payload.chainId || appConfig.govCoreChainId,
                  ).blockExplorers?.default.url}/address/${payload.creator}`}>
                  {textCenterEllipsis(payload.creator, 15, 10)}
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

          {isPayloadOnInitialState && (
            <PayloadItemStatusInfo
              title={texts.proposals.payloadsDetails.created}>
              <>{dayjs.unix(payload.createdAt).format('MMM D, YYYY, h:mm A')}</>
            </PayloadItemStatusInfo>
          )}

          {!isPayloadOnInitialState &&
            !isFinalStatus &&
            !isPayloadReadyForExecution && (
              <PayloadItemStatusInfo>
                {texts.proposals.payloadsDetails.timeLocked}
              </PayloadItemStatusInfo>
            )}

          {!isPayloadOnInitialState &&
            !isPayloadReadyForExecution &&
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
                {dayjs.unix(payload.executedAt).format('MMM D, YYYY, , h:mm A')}
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
                      : payload.queuedAt + payload.delay + payload.gracePeriod,
                  )
                  .format('MMM D, YYYY, , h:mm A')}
              </>
            </PayloadItemStatusInfo>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexDirection: 'column',
          mt: 4,
        }}>
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
                  ).blockExplorers?.default.url}/address/${address}#code$`}>
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

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          right: 1,
          bottom: 1,
          border: `2px solid ${theme.palette[statusColor]}`,
          color: `${theme.palette[statusColor]}`,
          typography: 'headline',
          p: '6px 12px',
        }}>
        {isPayloadOnInitialState && 'Created'}
        {!isPayloadOnInitialState &&
          !isFinalStatus &&
          !isPayloadReadyForExecution &&
          'Queued'}
        {!isPayloadOnInitialState &&
          !isFinalStatus &&
          isPayloadReadyForExecution && (
            <Box sx={{}}>
              Can be <br /> execute
            </Box>
          )}
        {isExecuted && 'Executed'}
        {payload.state === PayloadState.Expired && 'Expired'}
        {payload.state === PayloadState.Cancelled && 'Cancelled'}
      </Box>
    </BoxWith3D>
  );
}
