import { Box, SxProps, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import RocketToTop from '../../../assets/rocketToTop.svg';
import { BoxWith3D } from '../../BoxWith3D';
import { IconBox } from '../../primitives/IconBox';
import { TimelineItemType } from './types';

export function TimelineItem({
  children,
  color,
  finished,
  withoutDetails,
  setIsProposalHistoryOpen,
  sx,
}: {
  children: ReactNode;
  sx: SxProps;
  setIsProposalHistoryOpen?: (value: boolean) => void;
  withoutDetails?: boolean;
} & Pick<TimelineItemType, 'color' | 'finished'>) {
  const theme = useTheme();

  let afterStyles: SxProps = {};
  let colorStyles: SxProps = {};
  let bigColorStyles: SxProps = {};

  if (color === 'achieved') {
    afterStyles = {
      width: 4,
      height: 4,
      border: 'unset',
    };
    colorStyles = {
      backgroundColor: theme.palette.$main,
      width: 12,
      height: 12,
    };
  } else if (color === 'regular') {
    afterStyles = {
      width: 8,
      height: 8,
    };
    colorStyles = {
      backgroundColor: theme.palette.$light,
      width: 18,
      height: 18,
    };
  } else if (color === 'bigRegular') {
    afterStyles = {
      width: 12,
      height: 12,
    };
    bigColorStyles = {
      backgroundColor: theme.palette.$light,
      borderColor: theme.palette.$secondaryBorder,
      borderStyle: 'solid',
      borderWidth: '1px',
    };
  } else if (color === 'bigSuccess') {
    afterStyles = {
      width: 6,
      height: 6,
    };
  } else if (color === 'bigError') {
    afterStyles = {
      width: 6,
      height: 6,
    };
  } else if (color === 'bigCanceled') {
    afterStyles = {
      width: 6,
      height: 6,
    };
  }

  return (
    <Box sx={sx}>
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          '.TimelineItem__title': {
            minWidth: 200,
            position: 'absolute',
            bottom: 'calc(100% + 20px)',
          },
          '.TimelineItem__time': {
            position: 'absolute',
            minWidth: 80,
            top: 'calc(100% + 12px)',
            color: finished ? '$text' : '$textSecondary',
            [theme.breakpoints.up('lg')]: {
              minWidth: 95,
            },
          },
        }}>
        {color === 'bigCanceled' ||
        color === 'bigError' ||
        color === 'bigSuccess' ? (
          <Box
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              !withoutDetails
                ? setIsProposalHistoryOpen && setIsProposalHistoryOpen(true)
                : undefined
            }>
            <BoxWith3D
              withActions={!withoutDetails}
              wrapperCss={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              contentColor={
                color === 'bigCanceled'
                  ? '$textLight'
                  : color === 'bigError'
                    ? '$secondaryAgainst'
                    : '$secondaryFor'
              }
              bottomBorderColor={
                color === 'bigCanceled'
                  ? '$disabled'
                  : color === 'bigError'
                    ? '$mainAgainst'
                    : '$mainFor'
              }
              leftBorderColor={
                color === 'bigCanceled'
                  ? '$disabled'
                  : color === 'bigError'
                    ? '$mainAgainst'
                    : '$mainFor'
              }
              css={{
                width: 36,
                height: 36,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}>
              <Box sx={{ position: 'relative', bottom: 3, zIndex: 2 }}>
                <IconBox
                  sx={{
                    width: 28,
                    height: 38,
                    '> svg': {
                      width: 28,
                      height: 38,
                    },
                    '.black': {
                      fill: theme.palette.$mainElements,
                    },
                    '.white_bg_black_stroke': {
                      fill: theme.palette.$textWhite,
                      stroke: theme.palette.$mainElements,
                    },
                    '.white': {
                      fill: theme.palette.$textWhite,
                    },
                  }}>
                  <RocketToTop />
                </IconBox>
              </Box>
            </BoxWith3D>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                span: {
                  display: 'none',
                },
              }}>
              {children}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative',
              zIndex: 3,
              transition: 'all 0.2s ease',
              span: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                position: 'relative',
                ...bigColorStyles,
                div: {
                  display: 'block',
                  borderColor: finished
                    ? theme.palette.$main
                    : theme.palette.$secondaryBorder,
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  position: 'relative',
                  ...colorStyles,
                },

                '&:after': {
                  content: `''`,
                  backgroundColor: theme.palette.$mainLight,
                  position: 'absolute',
                  borderColor: finished
                    ? theme.palette.$main
                    : theme.palette.$secondaryBorder,
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderTopWidth: 3,
                  borderRightWidth: 3,
                  ...afterStyles,
                },
              },
            }}>
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
}
