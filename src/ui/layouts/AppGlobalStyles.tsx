import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider as PreferredThemeProvider } from 'next-themes';
import React, { ReactNode, useEffect } from 'react';

import { useRootStore } from '../../store/storeProvider';
import { createEmotionCache } from '../utils/themeMUI';
import { MUIThemeProvider } from './MUIThemeProvider';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export function AppGlobalStyles({
  children,
  emotionCache = clientSideEmotionCache,
}: {
  children: ReactNode;
  emotionCache?: EmotionCache;
}) {
  const setIsRendered = useRootStore((store) => store.setIsRendered);
  useEffect(() => setIsRendered(), []);

  return (
    <PreferredThemeProvider
      disableTransitionOnChange={true}
      defaultTheme="light">
      <CacheProvider value={emotionCache}>
        <MUIThemeProvider>{children}</MUIThemeProvider>
      </CacheProvider>
    </PreferredThemeProvider>
  );
}
