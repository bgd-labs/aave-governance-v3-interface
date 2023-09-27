import { Box, styled, SxProps, useTheme } from '@mui/system';
import { BigNumber } from 'bignumber.js';
import dayjs from 'dayjs';
import React, { ReactNode, useEffect, useRef } from 'react';

import Rocket from '/public/images/rocket.svg';
import RocketToTop from '/public/images/rocketToTop.svg';

import { ProposalStateWithName } from '../../../../lib/helpers/src';
import { useStore } from '../../../store';
import { BoxWith3D, NoSSR, Timer } from '../../../ui';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';

interface TimelineItemType {
  title: string;
  position?: number;
  finished: boolean;
  type: TimelineItemTypeType;
  timestamp: number;
  timestampForEstimatedState?: number;
  visibility?: boolean;
  state?: ProposalStateWithName;
  color?:
    | 'achieved'
    | 'regular'
    | 'bigRegular'
    | 'bigSuccess'
    | 'bigError'
    | 'bigCanceled';
  rocketVisible?: boolean;
}

enum TimelineItemTypeType {
  created = 'created',
  openToVote = 'openToVote',
  votingClosed = 'votingClosed',
  payloadsExecuted = 'payloadsExecuted',
  finished = 'Finished',
}

// static
const TimelineLineWrapper = styled('div')({
  position: 'absolute',
  left: 0,
  height: 6,
});

const CanceledItemWrapper = styled('div')({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  top: 2,
});

// dynamic
const TimelineLine = ({
  textColor = 'light',
  isFull,
  sx,
}: {
  textColor: 'light' | 'secondary';
  isFull?: boolean;
  sx: SxProps;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '0',
        maxWidth: '100%',
        height: 6,
        transition: 'all 0.2s ease',
        borderColor: isFull
          ? theme.palette.$secondaryBorder
          : theme.palette.$main,
        borderStyle: 'solid',
        borderWidth: '1px',
        position: 'absolute',
        backgroundColor:
          textColor === 'light' ? theme.palette.$light : theme.palette.$main,
        zIndex: textColor === 'light' ? 1 : 2,
        ...sx,
      }}
    />
  );
};

const TimelineItem = ({
  children,
  color,
  finished,
  withoutDetails,
  setIsProposalHistoryOpen,
  sx,
}: {
  children: ReactNode;
  sx: SxProps;
  setIsProposalHistoryOpen?: (value: boolean) => void;
} & Pick<TimelineItemType, 'color' | 'finished'> &
  Pick<ProposalTimelineProps, 'withoutDetails'>) => {
  const theme = useTheme();

  let afterStyles: SxProps = {};
  let colorStyles: SxProps = {};
  let bigColorStyles: SxProps = {};

  if (color === 'achieved') {
    afterStyles = {
      width: 4,
      height: 4,
      border: 'unset',
    };
    colorStyles = {
      backgroundColor: theme.palette.$main,
      width: 12,
      height: 12,
    };
  } else if (color === 'regular') {
    afterStyles = {
      width: 8,
      height: 8,
    };
    colorStyles = {
      backgroundColor: theme.palette.$light,
      width: 18,
      height: 18,
    };
  } else if (color === 'bigRegular') {
    afterStyles = {
      width: 12,
      height: 12,
    };
    bigColorStyles = {
      backgroundColor: theme.palette.$light,
      borderColor: theme.palette.$secondaryBorder,
      borderStyle: 'solid',
      borderWidth: '1px',
    };
  } else if (color === 'bigSuccess') {
    afterStyles = {
      width: 6,
      height: 6,
    };
  } else if (color === 'bigError') {
    afterStyles = {
      width: 6,
      height: 6,
    };
  } else if (color === 'bigCanceled') {
    afterStyles = {
      width: 6,
      height: 6,
    };
  }

  return (
    <Box sx={sx}>
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          '.TimelineItem__title': {
            minWidth: 200,
            position: 'absolute',
            bottom: 'calc(100% + 20px)',
          },
          '.TimelineItem__time': {
            position: 'absolute',
            minWidth: 80,
            top: 'calc(100% + 12px)',
            color: finished ? '$text' : '$textSecondary',
          },
        }}>
        {color === 'bigCanceled' ||
        color === 'bigError' ||
        color === 'bigSuccess' ? (
          <Box
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              !withoutDetails
                ? setIsProposalHistoryOpen && setIsProposalHistoryOpen(true)
                : undefined
            }>
            <BoxWith3D
              withActions={!withoutDetails}
              wrapperCss={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              contentColor={
                color === 'bigCanceled'
                  ? '$textLight'
                  : color === 'bigError'
                  ? '$secondaryAgainst'
                  : '$secondaryFor'
              }
              bottomBorderColor={
                color === 'bigCanceled'
                  ? '$disabled'
                  : color === 'bigError'
                  ? '$mainAgainst'
                  : '$mainFor'
              }
              leftBorderColor={
                color === 'bigCanceled'
                  ? '$disabled'
                  : color === 'bigError'
                  ? '$mainAgainst'
                  : '$mainFor'
              }
              css={{
                width: 36,
                height: 36,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}>
              <Box sx={{ position: 'relative', bottom: 3, zIndex: 2 }}>
                <IconBox
                  sx={{
                    width: 28,
                    height: 38,
                    '> svg': {
                      width: 28,
                      height: 38,
                    },
                    '.black': {
                      fill: theme.palette.$mainElements,
                    },
                    '.white_bg_black_stroke': {
                      fill: theme.palette.$textWhite,
                      stroke: theme.palette.$mainElements,
                    },
                    '.white': {
                      fill: theme.palette.$textWhite,
                    },
                  }}>
                  <RocketToTop />
                </IconBox>
              </Box>
            </BoxWith3D>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                span: {
                  display: 'none',
                },
              }}>
              {children}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative',
              zIndex: 3,
              transition: 'all 0.2s ease',
              span: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                position: 'relative',
                ...bigColorStyles,
                div: {
                  display: 'block',
                  borderColor: finished
                    ? theme.palette.$main
                    : theme.palette.$secondaryBorder,
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  position: 'relative',
                  ...colorStyles,
                },

                '&:after': {
                  content: `''`,
                  backgroundColor: theme.palette.$mainLight,
                  position: 'absolute',
                  borderColor: finished
                    ? theme.palette.$main
                    : theme.palette.$secondaryBorder,
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderTopWidth: 3,
                  borderRightWidth: 3,
                  ...afterStyles,
                },
              },
            }}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const StateWrapper = ({
  children,
  color,
}: {
  children: ReactNode;
  color: 'success' | 'error' | 'expired' | 'secondary';
}) => {
  return (
    <Box
      className="StateWrapper"
      sx={(theme) => ({
        position: 'absolute',
        top: 'calc(100% + 36px)',
        color:
          color === 'success'
            ? theme.palette.$mainFor
            : color === 'error'
            ? theme.palette.$mainAgainst
            : color === 'expired'
            ? theme.palette.$textDisabled
            : color === 'secondary'
            ? theme.palette.$text
            : theme.palette.$text,
      })}>
      {children}
    </Box>
  );
};

interface ProposalTimelineProps {
  createdTimestamp: number;
  openToVoteTimestamp: number;
  votingClosedTimestamp: number;
  payloadsExecutedTimestamp: number;
  expiredTimestamp: number;
  finishedTimestamp: number;
  isFinished: boolean;
  state: ProposalStateWithName;
  canceledTimestamp?: number;
  failedTimestamp?: number;
  votingStartTime: number;
  withoutDetails?: boolean;
}

export function ProposalTimeline({
  expiredTimestamp,
  createdTimestamp,
  openToVoteTimestamp,
  votingClosedTimestamp,
  payloadsExecutedTimestamp,
  finishedTimestamp,
  isFinished,
  state,
  canceledTimestamp,
  failedTimestamp,
  votingStartTime,
  withoutDetails,
}: ProposalTimelineProps) {
  const theme = useTheme();
  const mobileScrollingWrapper = useRef(null);
  const { setIsProposalHistoryOpen } = useStore();
  const isWrapperWithScroll = useMediaQuery('(max-width: 900px)');

  const now = dayjs().unix();

  useEffect(() => {
    if (mobileScrollingWrapper && mobileScrollingWrapper.current) {
      if (!isWrapperWithScroll && state) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mobileScrollingWrapper.current.scrollLeft = 0;
      }
      if (state === ProposalStateWithName.Created) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mobileScrollingWrapper.current.scrollLeft = 0;
      } else if (
        (state === ProposalStateWithName.Executed ||
          state === ProposalStateWithName.Canceled ||
          state === ProposalStateWithName.Expired ||
          state === ProposalStateWithName.Defeated) &&
        isWrapperWithScroll
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mobileScrollingWrapper.current.scrollLeft =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          mobileScrollingWrapper.current.scrollWidth;
      }
    }
  }, [mobileScrollingWrapper, state, isWrapperWithScroll]);

  const getPosition = (start: number, end: number) =>
    new BigNumber(now - start)
      .dividedBy(end - start)
      .multipliedBy(100)
      .toNumber();

  const isExecuted = state === ProposalStateWithName.Executed;
  const isFailed = state === ProposalStateWithName.Defeated;
  const isExpired = state === ProposalStateWithName.Expired;

  const getVotingClosedState = () => {
    if (now >= votingClosedTimestamp || !!canceledTimestamp) {
      if (isExecuted || state === ProposalStateWithName.Succeed) {
        return ProposalStateWithName.Succeed;
      } else if (state === ProposalStateWithName.Defeated) {
        return ProposalStateWithName.Failed;
      }
    } else {
      return undefined;
    }
  };

  const timelines: TimelineItemType[] = [
    {
      title: texts.proposals.timelinePointCreated,
      position: getPosition(createdTimestamp, openToVoteTimestamp),
      finished: true,
      timestamp: createdTimestamp,
      type: TimelineItemTypeType.created,
      visibility: true,
      rocketVisible: state === ProposalStateWithName.Created,
    },
    {
      title: texts.proposals.timelinePointOpenVote,
      position: getPosition(openToVoteTimestamp, votingClosedTimestamp),
      finished: now >= openToVoteTimestamp || !!canceledTimestamp || isExpired,
      timestampForEstimatedState: !(
        now >= openToVoteTimestamp ||
        !!canceledTimestamp ||
        isExpired
      )
        ? openToVoteTimestamp - now > 61
          ? openToVoteTimestamp
          : undefined
        : undefined,
      timestamp: openToVoteTimestamp,
      type: TimelineItemTypeType.openToVote,
      visibility: canceledTimestamp
        ? canceledTimestamp >= openToVoteTimestamp
        : true,
      rocketVisible:
        (state === ProposalStateWithName.Active ||
          state === ProposalStateWithName.Succeed) &&
        now <= votingClosedTimestamp &&
        !isFinished,
    },
    {
      title: texts.proposals.timelinePointVotingClosed,
      position: getPosition(votingClosedTimestamp, payloadsExecutedTimestamp),
      finished:
        now >= votingClosedTimestamp || !!canceledTimestamp || isExpired,
      timestampForEstimatedState:
        now >= openToVoteTimestamp &&
        !(now >= votingClosedTimestamp || !!canceledTimestamp || isExpired)
          ? votingClosedTimestamp - now > 61
            ? votingClosedTimestamp
            : undefined
          : undefined,
      timestamp: votingClosedTimestamp,
      type: TimelineItemTypeType.votingClosed,
      state: getVotingClosedState(),
      visibility: canceledTimestamp
        ? canceledTimestamp >= votingClosedTimestamp
        : true,
      rocketVisible: now >= votingClosedTimestamp && !isFinished,
    },
    {
      title: texts.proposals.timelinePointPayloadsExecuted,
      position:
        isFinished || !!canceledTimestamp
          ? withoutDetails
            ? 100
            : 90
          : getPosition(payloadsExecutedTimestamp, finishedTimestamp),
      finished: isFinished || !!canceledTimestamp,
      timestampForEstimatedState:
        now >= openToVoteTimestamp &&
        now >= votingClosedTimestamp &&
        !(isFinished || !!canceledTimestamp)
          ? payloadsExecutedTimestamp - now > 61
            ? payloadsExecutedTimestamp
            : undefined
          : undefined,
      timestamp: canceledTimestamp
        ? canceledTimestamp
        : payloadsExecutedTimestamp,
      type: TimelineItemTypeType.payloadsExecuted,
      visibility: isExpired
        ? false
        : canceledTimestamp
        ? false
        : failedTimestamp
        ? !failedTimestamp
        : true,
    },
    {
      title: texts.proposals.timelinePointFinished,
      finished: isFinished || !!canceledTimestamp,
      timestamp: isExpired
        ? expiredTimestamp
        : canceledTimestamp
        ? canceledTimestamp
        : failedTimestamp
        ? failedTimestamp
        : finishedTimestamp,
      type: TimelineItemTypeType.finished,
      state: isFinished || !!canceledTimestamp ? state : undefined,
      visibility: true,
      color:
        isFinished && isExecuted
          ? 'bigSuccess'
          : isFinished && isFailed
          ? 'bigError'
          : (isFinished && isExpired) || !!canceledTimestamp
          ? 'bigCanceled'
          : 'bigRegular',
    },
  ];

  const CanceledItem = ({ children }: { children: ReactNode }) => {
    if (canceledTimestamp) {
      const getPercent = (start: number, end: number) =>
        new BigNumber(canceledTimestamp - start)
          .dividedBy(end - start)
          .multipliedBy(100)
          .toNumber();

      if (canceledTimestamp <= votingClosedTimestamp) {
        return (
          <TimelineLineWrapper
            sx={{
              width: `calc(100% / ${timelines.length - 1})`,
              left: '24%',
            }}>
            <CanceledItemWrapper
              sx={{
                width: `${getPercent(
                  openToVoteTimestamp,
                  votingClosedTimestamp,
                )}%`,
              }}>
              {children}
            </CanceledItemWrapper>
          </TimelineLineWrapper>
        );
      } else if (
        canceledTimestamp <= payloadsExecutedTimestamp &&
        canceledTimestamp > votingClosedTimestamp
      ) {
        return (
          <TimelineLineWrapper
            sx={{
              width: `calc(100% / ${timelines.length - 1})`,
              left: '49%',
            }}>
            <CanceledItemWrapper
              sx={{
                width: `${getPercent(
                  votingClosedTimestamp,
                  payloadsExecutedTimestamp,
                )}%`,
              }}>
              {children}
            </CanceledItemWrapper>
          </TimelineLineWrapper>
        );
      } else if (canceledTimestamp > payloadsExecutedTimestamp) {
        return (
          <TimelineLineWrapper
            sx={{
              width: `calc(100% / ${timelines.length - 1})`,
              left: '74%',
            }}>
            <CanceledItemWrapper
              sx={{
                width: `${getPercent(
                  payloadsExecutedTimestamp,
                  finishedTimestamp,
                )}%`,
              }}>
              {children}
            </CanceledItemWrapper>
          </TimelineLineWrapper>
        );
      } else {
        return <></>;
      }
    } else {
      return <></>;
    }
  };

  return (
    <>
      <Box
        ref={mobileScrollingWrapper}
        sx={{
          overflowX: 'auto',
          px: 40,
          width: '100%',
          '@media only screen and (min-width: 900px)': { overflowX: 'hidden' },
        }}>
        <Box
          sx={{
            display: 'flex',
            position: 'relative',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 57,
            pt: 35,
            minWidth: 500,
            '@media only screen and (min-width: 900px)': {
              minWidth: 'unset',
            },
          }}>
          {timelines.map((timeline) => (
            <TimelineItem
              setIsProposalHistoryOpen={setIsProposalHistoryOpen}
              withoutDetails={withoutDetails}
              finished={timeline.finished}
              color={
                timeline.finished && !timeline.color
                  ? 'achieved'
                  : timeline.color
                  ? timeline.color
                  : 'regular'
              }
              sx={{
                '> div': {
                  opacity: timeline.visibility ? 1 : 0,
                  zIndex: timeline.visibility ? 3 : -1,
                  'span, .TimelineItem__title, .TimelineItem__time, .StateWrapper':
                    {
                      ml:
                        timeline.type !== TimelineItemTypeType.finished
                          ? -12
                          : 0,
                    },
                },
              }}
              key={timeline.type}>
              <Box
                className="TimelineItem__title"
                sx={{
                  typography: 'headline',
                  color: timeline.finished ? '$text' : '$textSecondary',
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {timeline.title}
                <Box
                  sx={{
                    typography: 'descriptor',
                    display: 'inline-block',
                    color: '$text',
                    position: 'absolute',
                    top: '100%',
                    span: {
                      display: 'inline !important',
                      m: '0 !important',
                      width: 'auto !important',
                      height: 'auto !important',
                      '&:after': {
                        display: 'none',
                      },
                    },
                  }}>
                  {timeline.timestampForEstimatedState && (
                    <Timer timestamp={timeline.timestampForEstimatedState} />
                  )}
                </Box>
              </Box>
              <span>
                <div />
              </span>
              <Box
                component="p"
                className="TimelineItem__time"
                sx={{ typography: 'descriptor' }}>
                {!isFinished &&
                  timeline.type !== TimelineItemTypeType.created &&
                  timeline.type !== TimelineItemTypeType.openToVote &&
                  timeline.type !== TimelineItemTypeType.votingClosed &&
                  '≈ '}
                {!isFinished &&
                  timeline.type === TimelineItemTypeType.openToVote &&
                  votingStartTime <= 0 &&
                  '≈ '}
                {!isFinished &&
                  timeline.type === TimelineItemTypeType.votingClosed &&
                  typeof getVotingClosedState() === 'undefined' &&
                  '≈ '}
                {dayjs.unix(timeline.timestamp).format('D MMM YYYY, h:mm A')}
              </Box>
              {timeline.state &&
                timeline.type === TimelineItemTypeType.votingClosed && (
                  <StateWrapper color="secondary">
                    <Box component="p" sx={{ typography: 'descriptorAccent' }}>
                      {timeline.state}
                    </Box>
                  </StateWrapper>
                )}
              {timeline.state &&
                timeline.type === TimelineItemTypeType.finished && (
                  <>
                    <StateWrapper
                      color={
                        timeline.state === ProposalStateWithName.Executed
                          ? 'success'
                          : timeline.state === ProposalStateWithName.Defeated
                          ? 'error'
                          : 'expired'
                      }>
                      <Box
                        component="p"
                        sx={{ typography: 'descriptorAccent' }}>
                        {timeline.state}
                      </Box>
                    </StateWrapper>
                  </>
                )}
            </TimelineItem>
          ))}

          <TimelineLine
            isFull={
              !(!!canceledTimestamp || isExpired || isFailed || isFinished)
            }
            textColor={
              !!canceledTimestamp || isExpired || isFailed || isFinished
                ? 'secondary'
                : 'light'
            }
            sx={{
              width: withoutDetails ? '99%' : '97%',
            }}
          />

          {timelines.map((timeline, index) => (
            <React.Fragment key={timeline.type}>
              {timeline.type !== TimelineItemTypeType.finished && (
                <TimelineLineWrapper
                  sx={{
                    width: `calc(100% / ${timelines.length - 1})`,
                    left: withoutDetails
                      ? `${
                          (100 / (timelines.length - 1)) * index -
                          (index === 2 ? 1.3 : index === 3 ? 1.8 : index)
                        }%`
                      : `${
                          (100 / (timelines.length - 1)) * index -
                          (index === 2 ? 2.5 : index === 3 ? 2.7 : index)
                        }%`,
                  }}>
                  <NoSSR>
                    <TimelineLine
                      textColor="secondary"
                      sx={{
                        width: `${timeline.position}%`,
                      }}
                    />
                    {!!timeline.position && timeline.rocketVisible && (
                      <IconBox
                        onClick={() =>
                          !withoutDetails
                            ? setIsProposalHistoryOpen(true)
                            : undefined
                        }
                        sx={{
                          width: 32,
                          height: 24,
                          '> svg': {
                            width: 32,
                            height: 24,
                            [theme.breakpoints.up('lg')]: {
                              width: 39,
                              height: 29,
                            },
                          },
                          position: 'absolute',
                          top: -10,
                          zIndex: 4,
                          cursor: !withoutDetails ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                          left:
                            (timeline.position || 0) < 10
                              ? 1
                              : (timeline.position || 0) < 20 &&
                                (timeline.position || 0) > 10
                              ? 15
                              : `calc(${timeline.position}% - 24px)`,
                          hover: {
                            transform: !withoutDetails
                              ? 'scale(1.15)'
                              : 'unset',
                          },
                          [theme.breakpoints.up('lg')]: {
                            top: -12,
                            width: 39,
                            height: 29,
                            left:
                              (timeline.position || 0) < 10
                                ? 8
                                : (timeline.position || 0) < 20 &&
                                  (timeline.position || 0) > 10
                                ? 15
                                : `calc(${timeline.position}% - 35px)`,
                          },
                          '.black': {
                            fill: theme.palette.$mainElements,
                          },
                          '.white_bg_black_stroke': {
                            fill: theme.palette.$textWhite,
                            stroke: theme.palette.$mainElements,
                          },
                          '.white': {
                            fill: theme.palette.$textWhite,
                          },
                        }}>
                        <Rocket />
                      </IconBox>
                    )}
                  </NoSSR>
                </TimelineLineWrapper>
              )}
            </React.Fragment>
          ))}

          {!!canceledTimestamp && (
            <CanceledItem>
              <TimelineItem
                finished
                color="achieved"
                sx={{
                  '> div': {
                    position: 'absolute',
                    right: 0,
                    top: 'calc(50% + 1px)',
                    transform: 'translateY(-50%)',
                  },
                }}>
                <Box
                  component="p"
                  className="TimelineItem__title"
                  sx={{
                    typography: 'headline',
                    color: '$text',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {texts.proposals.timelinePointCanceled}
                </Box>
                <span>
                  <div />
                </span>
                <Box
                  component="p"
                  className="TimelineItem__time"
                  sx={{ typography: 'descriptor' }}>
                  {dayjs.unix(canceledTimestamp).format('D MMM YYYY, h:mm A')}
                </Box>
              </TimelineItem>
            </CanceledItem>
          )}
        </Box>
      </Box>
    </>
  );
}
