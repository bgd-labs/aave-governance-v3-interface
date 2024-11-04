import { Box } from '@mui/system';
import { ReactNode } from 'react';

interface LeftPanelWrapperProps {
  children: ReactNode;
}

export function LeftPanelWrapper({ children }: LeftPanelWrapperProps) {
  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          width: 290,
          mr: 18,
          position: 'sticky',
          transition: 'all 0.5s ease',
          top: 50,
        },
        [theme.breakpoints.up('lg')]: {
          mr: 24,
          width: 340,
        },
        '@media only screen and (max-height: 550px)': {
          position: 'static',
        },
      })}>
      {children}
    </Box>
  );
}
