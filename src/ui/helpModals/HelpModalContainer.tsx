import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { HelpModalHomeButton } from './HelpModalHomeButton';

interface HelpModalContainerProps {
  children: ReactNode;
  onMainButtonClick?: () => void;
}

export const helpModalWidth = 1210;

export function HelpModalContainer({
  children,
  onMainButtonClick,
}: HelpModalContainerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: '0',
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '600px',
        },
        [theme.breakpoints.up('md')]: {
          minHeight: '645px',
        },
        [theme.breakpoints.up('lg')]: { minHeight: '700px' },
      }}>
      <Box
        sx={{
          width: '100%',
          pb: !!onMainButtonClick ? 35 : 0,
          position: 'relative',
          [theme.breakpoints.up('sm')]: {
            pb: !!onMainButtonClick ? 45 : 0,
          },
          [theme.breakpoints.up('md')]: {
            py: !!onMainButtonClick ? 45 : 0,
          },
        }}>
        {children}
      </Box>

      {!!onMainButtonClick && (
        <Box
          onClick={onMainButtonClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 25,
            [theme.breakpoints.up('sm')]: {
              justifyContent: 'flex-end',
              position: 'absolute',
              mt: 0,
              bottom: 0,
              right: 0,
            },
          }}>
          <HelpModalHomeButton />
        </Box>
      )}
    </Box>
  );
}
