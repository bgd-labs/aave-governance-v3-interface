import { Box, SxProps, useTheme } from '@mui/system';
import { MouseEventHandler, ReactNode } from 'react';

import { Spinner } from '..';
import { BoxWith3D } from './BoxWith3D';

export interface BigButtonProps {
  type?: 'button' | 'submit';
  color?: 'black' | 'white';
  activeColorType?: 'for' | 'against';
  children: string | ReactNode;
  disabled?: boolean;
  loading?: boolean;
  alwaysWithBorders?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  css?: SxProps;
  withoutActions?: boolean;
}

export function BigButton({
  type = 'button',
  color = 'black',
  activeColorType,
  children,
  disabled,
  loading,
  onClick,
  alwaysWithBorders,
  css,
  withoutActions,
}: BigButtonProps) {
  const theme = useTheme();

  const borderSize = 4;
  const mobileWidth = '97px';
  const mobileHeight = '35px';
  const tabletWidth = '134px';
  const tabletHeight = '44px';
  const width = '156px';
  const height = '50px';

  const contentColor = color === 'black' ? '$mainButton' : '$whiteButton';
  const textColor = color === 'black' ? '$textWhite' : '$text';
  const activeColor =
    activeColorType === 'for'
      ? '$mainFor'
      : activeColorType === 'against'
      ? '$mainAgainst'
      : color === 'white'
      ? '$light'
      : undefined;

  return (
    <Box className="BigButton" sx={{ display: 'inline-flex', ...css }}>
      <Box
        component="button"
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        sx={{
          minWidth: `calc(${mobileWidth} + ${borderSize}px)`,
          height: `calc(${mobileHeight} + ${borderSize}px)`,
          cursor: withoutActions
            ? 'default'
            : loading
            ? 'not-allowed'
            : 'pointer',
          '&:disabled': { cursor: 'not-allowed' },
          [theme.breakpoints.up('sm')]: {
            minWidth: `calc(${tabletWidth} + ${borderSize}px)`,
            height: `calc(${tabletHeight} + ${borderSize}px)`,
          },
          [theme.breakpoints.up('lg')]: {
            minWidth: `calc(${width} + ${borderSize}px)`,
            height: `calc(${height} + ${borderSize}px)`,
          },
        }}>
        <BoxWith3D
          borderSize={borderSize}
          contentColor={disabled ? '$buttonDisabled' : contentColor}
          activeContentColor={activeColor}
          borderLinesColor={disabled ? '$disabledBorder' : '$mainBorder'}
          disabled={disabled || loading}
          withActions={!withoutActions}
          alwaysWithBorders={alwaysWithBorders}
          css={{
            padding: 2,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '5px 10px',
            minWidth: mobileWidth,
            height: mobileHeight,
            [theme.breakpoints.up('sm')]: {
              minWidth: tabletWidth,
              height: tabletHeight,
            },
            [theme.breakpoints.up('lg')]: {
              minWidth: width,
              height,
            },
          }}>
          <Box
            className="BigButton__children"
            sx={{
              typography: 'buttonLarge',
              position: 'relative',
              zIndex: 5,
              whiteSpace: 'nowrap',
              color: disabled ? '$disabled' : textColor,
            }}>
            {children}
          </Box>
          {loading && (
            <Box
              sx={{
                backgroundColor: disabled ? '$buttonDisabled' : contentColor,
                ml: 5,
                position: 'relative',
                top: 0.5,
              }}>
              <Spinner
                size={16}
                loaderLineColor={disabled ? '$buttonDisabled' : contentColor}
                loaderCss={{
                  background:
                    color === 'black'
                      ? theme.palette.$lightStable
                      : theme.palette.$text,
                }}
                lineSize={3}
              />
            </Box>
          )}
        </BoxWith3D>
      </Box>
    </Box>
  );
}
