import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

export function TimelineItemStateWrapper({
  children,
  color,
}: {
  children: ReactNode;
  color: 'success' | 'error' | 'expired' | 'secondary';
}) {
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
        [theme.breakpoints.up('lg')]: {
          top: 'calc(100% + 40px)',
        },
      })}>
      {children}
    </Box>
  );
}
