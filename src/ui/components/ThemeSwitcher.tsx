import { Box, useTheme } from '@mui/system';
import { useTheme as useThemeNext } from 'next-themes';
import React from 'react';

import DarkThemeIcon from '/public/images/icons/darkTheme.svg';
import LightThemeIcon from '/public/images/icons/lightTheme.svg';

import { useStore } from '../../store';
import { NoSSR } from '..';
import { IconBox } from '../primitives/IconBox';

export function ThemeSwitcher() {
  const themeMUI = useTheme();
  const { theme, setTheme } = useThemeNext();
  const store = useStore();

  return (
    <Box
      component="button"
      type="button"
      onClick={() => {
        store.setIsThemeSwitched();
        setTimeout(() => setTheme(theme === 'light' ? 'dark' : 'light'), 10);
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px solid ${themeMUI.palette.$textWhite}`,
        backgroundColor: '$disabled',
        width: '100%',
        p: 3,
        position: 'relative',
      }}>
      <NoSSR>
        <Box
          sx={{
            backgroundColor: '$main',
            width: '49%',
            height: 32,
            position: 'absolute',
            top: 3,
            left: 3,
            transition: 'all 0.3s ease',
            transform:
              themeMUI.palette.mode === 'dark'
                ? 'translateX(calc(100% - 3px))'
                : 'unset',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            width: '49%',
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconBox
            sx={{
              '@keyframes iconAnimation': {
                '0%': {
                  transform: 'rotate(0)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },

              width: 23,
              height: 23,
              '> svg': {
                width: 23,
                height: 23,
              },
              animation:
                themeMUI.palette.mode === 'light' ? `iconAnimation 1.5s` : '',
              path: { fill: themeMUI.palette.$textLight },
            }}>
            <LightThemeIcon />
          </IconBox>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '49%',
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconBox
            sx={{
              '@keyframes iconAnimation': {
                '0%': {
                  transform: 'rotate(0)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },

              animation:
                themeMUI.palette.mode === 'dark' ? `iconAnimation 1.5s` : '',
              width: 20,
              height: 20,
              '> svg': {
                width: 20,
                height: 20,
              },
              path: {
                fill:
                  themeMUI.palette.mode === 'dark'
                    ? themeMUI.palette.$headerGray
                    : themeMUI.palette.$main,
              },
            }}>
            <DarkThemeIcon />
          </IconBox>
        </Box>
      </NoSSR>
    </Box>
  );
}
