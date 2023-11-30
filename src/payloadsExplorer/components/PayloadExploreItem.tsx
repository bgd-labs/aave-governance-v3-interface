import { Payload, PayloadState } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';
import { toHex } from 'viem';

import LinkIcon from '/public/images/icons/linkIcon.svg';

import { PayloadActions } from '../../proposals/components/proposal/PayloadActions';
import { PayloadItemStatusInfo } from '../../proposals/components/proposal/ProposalPayloads';
import { BoxWith3D, Link, SmallButton, Timer } from '../../ui';
import { CopyAndExternalIconsSet } from '../../ui/components/CopyAndExternalIconsSet';
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
      wrapperCss={{ mb: 18, [theme.breakpoints.up('sm')]: { mb: 24 } }}
      css={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        p: '18px',
        [theme.breakpoints.up('sm')]: {
          p: '18px 24px',
        },
        [theme.breakpoints.up('lg')]: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          p: '22px 30px',
        },
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
          <Box sx={{ display: 'flex', flexDirection: 'column', mr: 12 }}>
            <Box sx={{ typography: 'descriptorAccent' }}>
              Id(Hex): {toHex(payload.id)}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ typography: 'descriptorAccent' }}>
              {texts.proposals.payloadsDetails.accessLevel}:{' '}
              {payload.maximumAccessLevelRequired}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
          <Box sx={{ typography: 'descriptorAccent', wordBreak: 'break-word' }}>
            {texts.proposals.payloadsDetails.creator}:{' '}
            <Box sx={{ display: 'inline-flex', typography: 'descriptor' }}>
              <Link
                css={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  hover: {
                    opacity: 0.7,
                  },
                }}
                inNewWindow
                href={`${chainInfoHelper.getChainParameters(
                  payload.chainId || appConfig.govCoreChainId,
                ).blockExplorers?.default.url}/address/${payload.creator}`}>
                {textCenterEllipsis(payload.creator, 8, 6)}
              </Link>

              <CopyAndExternalIconsSet
                sx={{ '.CopyAndExternalIconsSet__copy': { mx: 4 } }}
                iconSize={10}
                copyText={payload.creator}
                externalLink={`${chainInfoHelper.getChainParameters(
                  payload.chainId || appConfig.govCoreChainId,
                ).blockExplorers?.default.url}/address/${payload.creator}`}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          {isPayloadOnInitialState && (
            <PayloadItemStatusInfo
              title={texts.proposals.payloadsDetails.created}>
              <>{dayjs.unix(payload.createdAt).format('MMM D, YYYY, h:mm A')}</>
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

        {!isFinalStatus && (
          <PayloadItemStatusInfo
            title={texts.proposals.payloadsDetails.expiredIn}>
            <Box sx={{ typography: 'descriptor' }}>
              <Timer timestamp={payloadExpiredTime} />
            </Box>
          </PayloadItemStatusInfo>
        )}
      </Box>

      <Box>
        <Box sx={{ typography: 'h2', mb: 12 }}>
          {texts.proposals.payloadsDetails.actions(
            payload.actionAddresses?.length || 0,
          )}
          :
        </Box>
        <PayloadActions payload={payload} withoutTitle textColor="$text" />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'column',
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
            mb: 12,
            minWidth: 95,
            [theme.breakpoints.up('lg')]: {
              minWidth: 102,
            },
          }}>
          {isPayloadOnInitialState && 'Created'}
          {!isPayloadOnInitialState &&
            !isFinalStatus &&
            !isPayloadReadyForExecution &&
            'Queued'}
          {!isPayloadOnInitialState &&
            !isFinalStatus &&
            isPayloadReadyForExecution && <>Can be execute</>}
          {isExecuted && 'Executed'}
          {payload.state === PayloadState.Expired && 'Expired'}
          {payload.state === PayloadState.Cancelled && 'Cancelled'}
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
    </BoxWith3D>
  );
}
