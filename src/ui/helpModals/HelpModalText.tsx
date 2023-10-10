import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

interface HelpModalTextProps {
  children: ReactNode;
  mb?: number;
}

export function HelpModalText({ children, mb }: HelpModalTextProps) {
  return (
    <Box
      component="p"
      sx={(theme) => ({
        typography: 'body',
        lineHeight: '20px !important',
        mb,
        [theme.breakpoints.up('lg')]: {
          typography: 'body',
          lineHeight: '24px !important',
        },
      })}>
      {children}
    </Box>
  );
}
