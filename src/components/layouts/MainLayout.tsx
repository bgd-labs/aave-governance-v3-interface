import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { Branding } from '../Branding';
import NoSSR from '../primitives/NoSSR';
import { AppHeader } from './AppHeader';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();

  const isThemeSwitched = useStore((store) => store.isThemeSwitched);

  return (
    <Box
      sx={{
        position: 'relative',
        pb: 40,
        minHeight: '100dvh',
        [theme.breakpoints.up('sm')]: {
          pt: 12,
        },
        [theme.breakpoints.up('lg')]: { pb: 60 },
      }}>
      <NoSSR>
        <Box
          sx={{
            opacity: isThemeSwitched ? 0 : 1,
            display:
              theme.palette.mode === 'dark' && !isThemeSwitched
                ? 'block'
                : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            background: `url('/assets/appBackgroundDark.svg')`,
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
          }}
        />
        <Box
          sx={{
            opacity: isThemeSwitched ? 0 : 1,
            display:
              theme.palette.mode !== 'dark' && !isThemeSwitched
                ? 'block'
                : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            background: `url('/assets/appBackground.svg')`,
            backgroundSize: 'cover',
          }}
        />
      </NoSSR>

      <AppHeader />

      <Box component="main" sx={{ position: 'relative', zIndex: 3 }}>
        {children}
      </Box>

      <Branding />
    </Box>
  );
}
