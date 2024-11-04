import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { texts } from '../utils/texts';

function secondsToDHMS(seconds: number) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return { d, h, m, s };
}

export interface TimerProps {
  timestamp: number;
  callbackFuncWhenTimerFinished?: () => void;
}

export function Timer({
  timestamp,
  callbackFuncWhenTimerFinished,
}: TimerProps) {
  const [d, setD] = useState(secondsToDHMS(timestamp - dayjs().unix()).d);
  const [h, setH] = useState(secondsToDHMS(timestamp - dayjs().unix()).h);
  const [m, setM] = useState(secondsToDHMS(timestamp - dayjs().unix()).m);
  const [s, setS] = useState(secondsToDHMS(timestamp - dayjs().unix()).s);

  useEffect(() => {
    setD(secondsToDHMS(timestamp - dayjs().unix()).d);
    setH(secondsToDHMS(timestamp - dayjs().unix()).h);
    setM(secondsToDHMS(timestamp - dayjs().unix()).m);
    setS(secondsToDHMS(timestamp - dayjs().unix()).s);
  }, [timestamp]);

  useEffect(() => {
    const interval = setInterval(() => {
      setD(secondsToDHMS(timestamp - dayjs().unix()).d);
      setH(secondsToDHMS(timestamp - dayjs().unix()).h);
      setM(secondsToDHMS(timestamp - dayjs().unix()).m);
      setS(secondsToDHMS(timestamp - dayjs().unix()).s);
    }, 1000);

    if (Date.now() / 1000 > timestamp || s < 0) {
      clearInterval(interval);
      callbackFuncWhenTimerFinished && callbackFuncWhenTimerFinished();
    }

    return () => clearInterval(interval);
  }, [s]);

  if (s < 0) return null;

  return (
    <>
      {d !== 0 && (
        <span className="Timer__value">
          {d}
          {texts.other.day}{' '}
        </span>
      )}
      {h !== 0 && (
        <span className="Timer__value">
          {h}
          {texts.other.hours}{' '}
        </span>
      )}
      {m !== 0 && (
        <span className="Timer__value">
          {m}
          {texts.other.minutes}{' '}
        </span>
      )}
      {h < 1 && d < 1 && (
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
          {s}
          {texts.other.seconds}
        </Box>
      )}
    </>
  );
}
