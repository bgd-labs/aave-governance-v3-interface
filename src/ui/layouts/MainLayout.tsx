import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { useStore } from '../../store';
import NoSSR from '../primitives/NoSSR';
import { setRelativePath } from '../utils/relativePath';
import { AppHeader } from './AppHeader';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const store = useStore();
  const theme = useTheme();

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
            opacity: store.isThemeSwitched ? 0 : 1,
            display:
              theme.palette.mode === 'dark' && !store.isThemeSwitched
                ? 'block'
                : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            background: `url(${setRelativePath(
              '/images/appBackgroundDark.svg',
            )})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
          }}
        />
        <Box
          sx={{
            opacity: store.isThemeSwitched ? 0 : 1,
            display:
              theme.palette.mode !== 'dark' && !store.isThemeSwitched
                ? 'block'
                : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            background: `url(${setRelativePath('/images/appBackground.svg')})`,
            backgroundSize: 'cover',
          }}
        />
      </NoSSR>

      <AppHeader />

      <Box component="main" sx={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>
    </Box>
  );
}
