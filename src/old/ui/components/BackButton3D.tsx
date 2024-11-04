import { Box, SxProps, useTheme } from '@mui/system';
import React from 'react';

import BackArrow from '/public/images/icons/backArrow.svg';

import { useStore } from '../../store/ZustandStoreProvider';
import { IconBox } from '../primitives/IconBox';
import { texts } from '../utils/texts';
import { BoxWith3D } from './BoxWith3D';

interface BackButton3DProps {
  onClick: () => void;
  isVisibleOnMobile?: boolean;
  alwaysWithBorders?: boolean;
  isSmall?: boolean;
  wrapperCss?: SxProps;
  css?: SxProps;
  alwaysVisible?: boolean;
}

export function BackButton3D({
  onClick,
  isVisibleOnMobile,
  alwaysWithBorders,
  isSmall,
  wrapperCss,
  css,
  alwaysVisible,
}: BackButton3DProps) {
  const theme = useTheme();

  const isRendered = useStore((store) => store.isRendered);

  if (typeof window !== 'undefined') {
    if (window.history.length <= 1 && !alwaysVisible) {
      return null;
    }
  }

  return (
    <div className="BackButton3D">
      <Box
        component="button"
        type="button"
        onClick={onClick}
        sx={{
          display: isVisibleOnMobile ? 'inline-flex' : 'none',
          [theme.breakpoints.up('sm')]: { display: 'inline-flex' },
        }}>
        <BoxWith3D
          withActions
          borderSize={isSmall ? 6 : 10}
          leftBorderColor="$secondary"
          bottomBorderColor="$headerGray"
          alwaysWithBorders={alwaysWithBorders}
          wrapperCss={wrapperCss}
          css={{
            minWidth: 84,
            height: 28,
            transition: 'all 0.1s ease',
            [theme.breakpoints.up('sm')]: {
              minWidth: 112,
              height: 32,
            },
            [theme.breakpoints.up('lg')]: {
              minWidth: isSmall ? 108 : 130,
              height: isSmall ? 30 : 36,
            },
          }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              ...css,
            }}>
            <IconBox
              className="BackButton3D__icon"
              sx={(theme) => ({
                mr: 5,
                zIndex: 2,
                width: 15,
                height: 15,
                '> svg': {
                  width: 15,
                  height: 15,
                  [theme.breakpoints.up('lg')]: {
                    width: isSmall ? 15 : 21,
                    height: isSmall ? 15 : 21,
                  },
                },
                [theme.breakpoints.up('lg')]: {
                  width: isSmall ? 15 : 21,
                  height: isSmall ? 15 : 21,
                  mr: isSmall ? 5 : 10,
                },
                path: {
                  transition: 'all 0.2s ease',
                  fill: isRendered
                    ? `${theme.palette.$textLight} !important`
                    : theme.palette.$textLight,
                },
              })}>
              <BackArrow />
            </IconBox>

            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box
                className="BackButton3D__title"
                component="p"
                sx={{
                  typography: isSmall ? 'body' : 'h3',
                  lineHeight: 1,
                  letterSpacing: '0.03em',
                  color: isRendered
                    ? `${theme.palette.$textLight} !important`
                    : theme.palette.$textLight,
                }}>
                {texts.other.backButtonTitle}
              </Box>
            </Box>
          </Box>
        </BoxWith3D>
      </Box>
    </div>
  );
}
