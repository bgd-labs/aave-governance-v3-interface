import { Box, SxProps, useTheme } from '@mui/system';
import React from 'react';

export function TimelineLine({
  textColor = 'light',
  isFull,
  sx,
}: {
  textColor: 'light' | 'secondary';
  isFull?: boolean;
  sx: SxProps;
}) {
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
}
