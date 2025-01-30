import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React from 'react';
import { useTimer } from 'react-timer-hook';

import { texts } from '../helpers/texts/texts';
import NoSSR from './primitives/NoSSR';

export function Timer({
  expiryTimestamp,
  onExpire,
}: {
  expiryTimestamp: number;
  onExpire?: () => void;
}) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: dayjs.unix(expiryTimestamp).toDate(),
    onExpire,
  });

  return (
    <NoSSR>
      {days !== 0 && (
        <span className="Timer__value">
          {days}
          {texts.other.day}{' '}
        </span>
      )}
      {hours !== 0 && (
        <span className="Timer__value">
          {hours}
          {texts.other.hours}{' '}
        </span>
      )}
      {minutes !== 0 && (
        <span className="Timer__value">
          {minutes}
          {texts.other.minutes}{' '}
        </span>
      )}
      {hours < 1 && days < 1 && seconds !== 0 && (
        <Box
          component="span"
          className="Timer__value"
          sx={(theme) => ({
            display: 'inline-flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            minWidth: 24,
            [theme.breakpoints.up('xl')]: { minWidth: 29 },
          })}>
          {seconds}
          {texts.other.seconds}
        </Box>
      )}
    </NoSSR>
  );
}
