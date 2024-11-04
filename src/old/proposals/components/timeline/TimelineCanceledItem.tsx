import { BigNumber } from 'bignumber.js';
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
      new BigNumber(canceledTimestamp - start)
        .dividedBy(end - start)
        .multipliedBy(100)
        .toNumber();

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
