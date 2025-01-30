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
      sx={{
        typography: 'body',
        mb,
      }}>
      {children}
    </Box>
  );
}
