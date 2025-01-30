import { createTheme, ThemeProvider } from '@mui/system';
import { useTheme } from 'next-themes';
import React, { ReactNode, useEffect, useState } from 'react';

import { FONT, getDesignTokens } from '../styles/themeMUI';

export function MUIThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(
    createTheme(
      getDesignTokens((resolvedTheme as 'light' | 'dark') || 'light'),
    ),
  );

  useEffect(() => {
    resolvedTheme === 'light'
      ? setCurrentTheme(createTheme(getDesignTokens('light')))
      : setCurrentTheme(createTheme(getDesignTokens('dark')));
  }, [resolvedTheme]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.h1 = {
    fontFamily: FONT,
    fontWeight: '700',
    letterSpacing: '0.03em',
    fontSize: 16,
    lineHeight: '23px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 20,
      lineHeight: '28px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.h2 = {
    fontFamily: FONT,
    fontWeight: '600',
    letterSpacing: '0.03em',
    fontSize: 15,
    lineHeight: '18px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 18,
      lineHeight: '23px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.h3 = {
    fontFamily: FONT,
    fontWeight: '400',
    letterSpacing: '0.03em',
    fontSize: 14,
    lineHeight: '17px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 16,
      lineHeight: '19px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.headline = {
    fontFamily: FONT,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: '20px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 15,
      lineHeight: '24px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.body = {
    fontFamily: FONT,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: '20px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 15,
      lineHeight: '24px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.descriptor = {
    fontFamily: FONT,
    fontWeight: '300',
    fontSize: 11,
    lineHeight: '13px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 12,
      lineHeight: '14px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.descriptorAccent = {
    fontFamily: FONT,
    fontWeight: '700',
    fontSize: 11,
    lineHeight: '13px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 12,
      lineHeight: '14px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.buttonLarge = {
    fontFamily: FONT,
    fontWeight: '700',
    letterSpacing: '0.03em',
    fontSize: 14,
    lineHeight: '17px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 15,
      lineHeight: '18px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.buttonMedium = {
    fontFamily: FONT,
    fontWeight: '600',
    letterSpacing: '0.03em',
    fontSize: 14,
    lineHeight: '17px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 14,
      lineHeight: '17px',
    },
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  currentTheme.typography.buttonSmall = {
    fontFamily: FONT,
    fontWeight: '400',
    letterSpacing: '0.03em',
    fontSize: 13,
    lineHeight: '15px',
    [currentTheme.breakpoints.up('lg')]: {
      fontSize: 15,
      lineHeight: '18px',
    },
  };

  return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
}
