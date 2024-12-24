import React, { ReactNode } from 'react';

import { TimelineCanceledItemWrapper, TimelineLineWrapper } from './static';

interface TimelineCanceledItemProps {
  children: ReactNode;
  timelinesLength: number;
  openToVoteTimestamp: number;
  votingClosedTimestamp: number;
  finishedTimestamp: number;
  canceledTimestamp?: number;
}

export function TimelineCanceledItem({
  children,
  timelinesLength,
  openToVoteTimestamp,
  votingClosedTimestamp,
  finishedTimestamp,
  canceledTimestamp,
}: TimelineCanceledItemProps) {
  if (canceledTimestamp) {
    const getPercent = (start: number, end: number) =>
      ((canceledTimestamp - start) / (end - start)) * 100;

    if (canceledTimestamp <= votingClosedTimestamp) {
      return (
        <TimelineLineWrapper
          sx={{
            width: `calc(100% / ${timelinesLength - 1})`,
            left: '55%',
          }}>
          <TimelineCanceledItemWrapper
            sx={{
              width: `${getPercent(
                openToVoteTimestamp,
                votingClosedTimestamp,
              )}%`,
            }}>
            {children}
          </TimelineCanceledItemWrapper>
        </TimelineLineWrapper>
      );
    } else if (
      canceledTimestamp <= finishedTimestamp &&
      canceledTimestamp > votingClosedTimestamp
    ) {
      return (
        <TimelineLineWrapper
          sx={{
            width: `calc(100% / ${timelinesLength - 1})`,
            left: '55%',
          }}>
          <TimelineCanceledItemWrapper
            sx={{
              width: `${getPercent(votingClosedTimestamp, finishedTimestamp)}%`,
            }}>
            {children}
          </TimelineCanceledItemWrapper>
        </TimelineLineWrapper>
      );
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
}
