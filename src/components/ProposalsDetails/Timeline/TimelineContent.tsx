import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';

import Rocket from '../../../assets/rocket.svg';
import { texts } from '../../../helpers/texts/texts';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { ProposalStateWithName } from '../../../types';
import { IconBox } from '../../primitives/IconBox';
import { Timer } from '../../Timer';
import { generateTimelinePositions, getVotingClosedState } from './helpers';
import { TimelineLineWrapper } from './static';
import { TimelineCanceledItem } from './TimelineCanceledItem';
import { TimelineItem } from './TimelineItem';
import { TimelineItemStateWrapper } from './TimelineItemStateWrapper';
import { TimelineLine } from './TimelineLine';
import { TimelineItemTypeType } from './types';

interface TimelineContentProps {
  createdTimestamp: number;
  openToVoteTimestamp: number;
  votingClosedTimestamp: number;
  expiredTimestamp: number;
  finishedTimestamp: number;
  isFinished: boolean;
  state: ProposalStateWithName;
  canceledTimestamp?: number;
  failedTimestamp?: number;
  votingStartTime: number;
  withoutDetails?: boolean;
}

export function TimelineContent({
  expiredTimestamp,
  createdTimestamp,
  openToVoteTimestamp,
  votingClosedTimestamp,
  finishedTimestamp,
  isFinished,
  state,
  canceledTimestamp,
  failedTimestamp,
  votingStartTime,
  withoutDetails,
}: TimelineContentProps) {
  const theme = useTheme();
  const mobileScrollingWrapper = useRef(null);
  const setIsProposalHistoryOpen = useStore(
    (store) => store.setIsProposalHistoryOpen,
  );
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
          state === ProposalStateWithName.Failed) &&
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

  const isExecuted = state === ProposalStateWithName.Executed;
  const isFailed = state === ProposalStateWithName.Failed;
  const isExpired = state === ProposalStateWithName.Expired;

  const timelines = generateTimelinePositions({
    now,
    createdTimestamp,
    openToVoteTimestamp,
    votingClosedTimestamp,
    finishedTimestamp,
    expiredTimestamp,
    isExpired,
    isFinished,
    isExecuted,
    isFailed,
    state,
    canceledTimestamp,
    failedTimestamp,
  });

  const isFinal = !!canceledTimestamp || isExpired || isFailed || isFinished;

  return (
    <Box
      ref={mobileScrollingWrapper}
      sx={{
        overflowX: 'auto',
        px: 40,
        pl: 60,
        width: '100%',
        '@media only screen and (min-width: 960px)': { overflowX: 'hidden' },
      }}>
      <Box
        sx={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 57,
          pt: 45,
          minWidth: 500,
          '@media only screen and (min-width: 960px)': {
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
                      timeline.type !== TimelineItemTypeType.finished ? -12 : 0,
                  },
                '.Timer__value': {
                  background: 'none',
                  border: 'none',
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
                  <Timer
                    expiryTimestamp={timeline.timestampForEstimatedState}
                  />
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
                timeline.type === TimelineItemTypeType.finished &&
                '≈ '}
              {!isFinished &&
                timeline.type === TimelineItemTypeType.openToVote &&
                votingStartTime <= 0 &&
                '≈ '}
              {!isFinished &&
                timeline.type === TimelineItemTypeType.votingClosed &&
                typeof getVotingClosedState({
                  now,
                  votingClosedTimestamp,
                  canceledTimestamp,
                  isExecuted,
                  state,
                }) === 'undefined' &&
                '≈ '}
              {dayjs.unix(timeline.timestamp).format('D MMM YYYY, h:mm A')}
            </Box>

            {timeline.state &&
              timeline.type === TimelineItemTypeType.votingClosed && (
                <TimelineItemStateWrapper color="secondary">
                  <Box component="p" sx={{ typography: 'descriptorAccent' }}>
                    {timeline.state}
                  </Box>
                </TimelineItemStateWrapper>
              )}
            {timeline.state &&
              timeline.type === TimelineItemTypeType.finished && (
                <>
                  <TimelineItemStateWrapper
                    color={
                      timeline.state === ProposalStateWithName.Executed
                        ? 'success'
                        : timeline.state === ProposalStateWithName.Failed
                          ? 'error'
                          : 'expired'
                    }>
                    <Box component="p" sx={{ typography: 'descriptorAccent' }}>
                      {timeline.state}
                    </Box>
                  </TimelineItemStateWrapper>
                </>
              )}
          </TimelineItem>
        ))}

        <TimelineLine
          isFull={!isFinal}
          textColor={isFinal ? 'secondary' : 'light'}
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
                <>
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
                            ? 0
                            : (timeline.position || 0) < 20 &&
                                (timeline.position || 0) > 10
                              ? 15
                              : `calc(${
                                  timeline.position <= 99
                                    ? timeline.position
                                    : 99
                                }% - 24px)`,
                        hover: {
                          transform: !withoutDetails ? 'scale(1.15)' : 'unset',
                        },
                        [theme.breakpoints.up('lg')]: {
                          top: -12,
                          width: 39,
                          height: 29,
                          left:
                            (timeline.position || 0) < 10
                              ? 2
                              : (timeline.position || 0) < 20 &&
                                  (timeline.position || 0) > 10
                                ? 15
                                : `calc(${
                                    timeline.position <= 99
                                      ? timeline.position
                                      : 99
                                  }% - 35px)`,
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
                </>
              </TimelineLineWrapper>
            )}
          </React.Fragment>
        ))}

        {!!canceledTimestamp && (
          <TimelineCanceledItem
            canceledTimestamp={canceledTimestamp}
            finishedTimestamp={finishedTimestamp}
            timelinesLength={timelines.length}
            openToVoteTimestamp={openToVoteTimestamp}
            votingClosedTimestamp={votingClosedTimestamp}>
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
          </TimelineCanceledItem>
        )}
      </Box>
    </Box>
  );
}
