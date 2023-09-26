import { Box, SxProps, useTheme } from '@mui/system';
import { ReactNode, useState } from 'react';

import CrossIcon from '/public/images/icons/cross.svg';

import { BoxWith3D } from '../components/BoxWith3D';
import { IconBox } from '../primitives/IconBox';

interface HelpModalTooltipProps {
  maxWidth: number;
  children: ReactNode;
  countNumber?: number;
  position?: 'left' | 'right';
  mobileBottomPadding?: number;
  css?: SxProps;
}

export function HelpModalTooltip({
  maxWidth,
  children,
  countNumber = 1,
  position = 'left',
  mobileBottomPadding,
  css,
}: HelpModalTooltipProps) {
  const theme = useTheme();
  const [isMouseEnter, setIsMouseEnter] = useState(false);

  return (
    <Box
      onMouseLeave={() => setIsMouseEnter(false)}
      sx={{
        display: 'flex',
        position: 'relative',
        zIndex: isMouseEnter ? 5 : 4,
        ...css,
      }}>
      <Box onMouseOver={() => setIsMouseEnter(true)} sx={{ cursor: 'pointer' }}>
        <BoxWith3D
          alwaysWithBorders
          withActions
          borderSize={6}
          leftBorderColor="$secondary"
          bottomBorderColor="$headerGray"
          disabled={isMouseEnter}
          borderLinesColor={isMouseEnter ? '$textLight' : '$middleLight'}
          css={{
            color: '$textWhite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            [theme.breakpoints.up('lg')]: {
              width: 34,
              height: 34,
            },
          }}>
          <Box component="p" sx={{ typography: 'body' }}>
            {countNumber}
          </Box>
        </BoxWith3D>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          opacity: isMouseEnter ? 1 : 0,
          overflow: 'hidden',
          visibility: isMouseEnter ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
          width: '95vw',
          bottom: 0,
          left: 0,
          borderColor: '$mainElements',
          borderStyle: 'solid',
          borderWidth: '3px',
          pb: mobileBottomPadding || 10,
          [theme.breakpoints.up('xsm')]: {
            width: '97.5vw',
          },
          [theme.breakpoints.up('sm')]: {
            border: 'none',
            p: '17px 17px 17px 25px',
            backgroundColor: '$mainElements',
            bottom: 10,
            left: position === 'left' ? 'calc(100% - 20px)' : 'auto',
            right: position === 'right' ? 'calc(100% - 20px)' : 'auto',
            width: maxWidth,
          },
        }}>
        <Box
          sx={{
            position: 'relative',
            backgroundColor: '$mainElements',
            color: '$textWhite',
            p: '15px 40px 15px 15px',
            [theme.breakpoints.up('sm')]: {
              p: 0,
            },
          }}>
          {children}
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: '$textWhite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 3,
              top: 3,
              svg: {
                path: {
                  stroke: theme.palette.$mainElements,
                },
              },
              [theme.breakpoints.up('sm')]: { display: 'none' },
            }}
            onClick={() => setIsMouseEnter(false)}>
            <IconBox
              sx={{
                width: 12,
                height: 12,
                '> svg': { width: 12, height: 12 },
              }}>
              <CrossIcon />
            </IconBox>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
