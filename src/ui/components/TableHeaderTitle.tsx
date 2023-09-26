import { Box, SxProps } from '@mui/system';
import React from 'react';

interface TableHeaderTitleProps {
  title?: string;
  right?: boolean;
  center?: boolean;
  css?: SxProps;
}

export function TableHeaderTitle({
  title,
  center,
  right,
  css,
}: TableHeaderTitleProps) {
  return (
    <Box sx={{ flex: center ? 2 : 1, ...css }}>
      <Box
        component="h2"
        sx={(theme) => ({
          typography: 'h2',
          display: 'inline-flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: center ? 'center' : right ? 'flex-end' : 'flex-start',
          [theme.breakpoints.up('sm')]: {
            typography: 'h2',
            height: 47,
          },
          [theme.breakpoints.up('md')]: {
            typography: 'h2',
            height: 62,
          },
        })}>
        {title}
      </Box>
    </Box>
  );
}
