import { Box, useTheme } from '@mui/system';
import React, { ReactNode, useEffect } from 'react';

import { useStore } from '../../store';
import { isForIPFS } from '../../utils/appConfig';
import { AppLoading } from '../components/AppLoading';
import { Branding } from '../components/Branding';
import NoSSR from '../primitives/NoSSR';
import { setRelativePath } from '../utils/relativePath';
import { AppHeader } from './AppHeader';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const store = useStore();
  const theme = useTheme();

  useEffect(() => {
    store.setGovCoreConfigs();
  }, []);

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

      <Box component="main" sx={{ position: 'relative', zIndex: 3 }}>
        {store.loadingListCache && !isForIPFS ? (
          children
        ) : (
          <>
            {!!store.configs.length &&
            store.contractsConstants.expirationTime > 0 ? (
              children
            ) : (
              <AppLoading />
            )}
          </>
        )}
      </Box>

      <Branding />
    </Box>
  );
}
