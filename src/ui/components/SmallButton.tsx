import { Box, SxProps, useTheme } from '@mui/system';
import React, { MouseEventHandler, ReactNode } from 'react';

import { useRootStore } from '../../store/storeProvider';
import { Spinner } from './Spinner';

const borderSize = 3;

interface BoxWith3DProps {
  children: ReactNode;
  contentColor?: string;
  borderLinesColor?: string;
  leftBorderColor?: string;
  bottomBorderColor?: string;
  wrapperCss?: SxProps;
  css?: SxProps;
  className?: string;
  disabled?: boolean;
}

function InitialBox({ disabled, borderLinesColor, children }: BoxWith3DProps) {
  const theme = useTheme();

  return (
    <Box
      className="BoxWith3DButton__initial--box"
      sx={{
        position: 'relative',
        pb: borderSize,
        pl: borderSize,
        hover: disabled
          ? undefined
          : {
              '.BoxWith3DButton__left-shadow': {
                transition: 'all 0.15s ease',
                width: borderSize,
                top: borderSize / 2,
              },
              '.BoxWith3DButton__bottom-shadow': {
                transition: 'all 0.09s ease',
                height: borderSize,
                left: borderSize / 2,
                width: `calc(100% + ${borderSize / 6}px)`,
              },
              '.BoxWith3DButton__content': {
                transform: `translate(-0px, 0px)`,
              },
            },
        '&:active': disabled
          ? undefined
          : {
              '.BoxWith3DButton__left-shadow': {
                transition: 'all 0.15s ease',
                width: 0,
                top: borderSize,
              },
              '.BoxWith3DButton__bottom-shadow': {
                transition: 'all 0.09s ease',
                height: 0,
                left: -0.5,
              },
              '.BoxWith3DButton__content': {
                transform: `translate(-${borderSize}px, ${borderSize}px)`,
              },
              '.SmallButton__inner': {
                backgroundColor: `${theme.palette.$appBackground} !important`,
                borderTop: `1px solid ${borderLinesColor}`,
                borderRight: `1px solid ${borderLinesColor}`,
              },
            },
      }}>
      {children}
    </Box>
  );
}

function BoxWith3D({
  disabled,
  children,
  wrapperCss,
  contentColor = '$mainStable',
  borderLinesColor = '$mainBorder',
  leftBorderColor = '$middleLight',
  bottomBorderColor = '$light',
  css,
  className,
}: BoxWith3DProps) {
  const isRendered = useRootStore((store) => store.isRendered);
  const theme = useTheme();

  const contentColorWithRender = isRendered
    ? `${theme.palette[contentColor]} !important`
    : theme.palette[contentColor];
  const leftBorderColorWithRender = isRendered
    ? `${theme.palette[leftBorderColor]} !important`
    : theme.palette[leftBorderColor];
  const bottomBorderColorWithRender = isRendered
    ? `${theme.palette[bottomBorderColor]} !important`
    : theme.palette[bottomBorderColor];
  const borderLinesColorWithRender = isRendered
    ? `${theme.palette[borderLinesColor]} !important`
    : theme.palette[borderLinesColor];

  return (
    <Box sx={wrapperCss} className={`"BoxWith3DButton ${className}`}>
      <InitialBox
        borderLinesColor={borderLinesColorWithRender}
        disabled={disabled}>
        <Box
          className="BoxWith3DButton__left-shadow"
          sx={{
            position: 'absolute',
            backgroundColor: leftBorderColorWithRender,
            transform: 'skewY(-45deg)',
            left: 0,
            border: `1px solid ${borderLinesColorWithRender}`,
            borderRight: 'unset !important',
            transition: 'all 0.07s ease',
            top: borderSize + 0.2,
            height: `calc(100% - ${borderSize}px)`,
            width: 0,
          }}
        />
        <Box
          className="BoxWith3DButton__bottom-shadow"
          sx={{
            position: 'absolute',
            backgroundColor: bottomBorderColorWithRender,
            transform: 'skewX(-45deg)',
            bottom: 0,
            border: `1px solid ${borderLinesColorWithRender}`,
            borderTop: 'none !important',
            borderLeft: 'none !important',
            transition: 'all 0.07s ease',
            width: `calc(100% - ${borderSize}px)`,
            height: 0,
            left: 0,
          }}
        />

        <Box
          className="BoxWith3DButton__content"
          sx={{
            position: 'relative',
            zIndex: 3,
            backgroundColor: contentColorWithRender,
            transitionProperty: 'transform, width, height, background',
            transitionDuration: '0.15s',
            transitionTimingFunction: 'ease',
            width: `calc(100% + ${borderSize}px)`,
            transform: `translate(-${borderSize}px, ${borderSize}px)`,
          }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              border: `1px solid ${borderLinesColorWithRender}`,
              ...css,
            }}>
            {children}
          </Box>
        </Box>
      </InitialBox>
    </Box>
  );
}

export interface SmallButtonProps {
  type?: 'button' | 'submit';
  children: string | ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function SmallButton({
  type,
  children,
  disabled,
  loading,
  onClick,
}: SmallButtonProps) {
  const theme = useTheme();

  return (
    <Box
      className="SmallButton"
      component="button"
      type={type}
      disabled={disabled || loading}
      onClick={onClick}>
      <BoxWith3D
        disabled={disabled || loading}
        css={{
          transition: 'all 0.2s ease',
          minWidth: 95,
          height: 20,
          position: 'relative',
          [theme.breakpoints.up('lg')]: {
            minWidth: 102,
            height: 22,
          },
        }}>
        <Box
          className="SmallButton__inner"
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            zIndex: 5,
            width: '100%',
            height: '100%',
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: `1px solid transparent`,
            borderRight: `1px solid transparent`,
            transition: 'all 0.2s ease',
            backgroundColor: disabled || loading ? '$disabled' : '$mainLight',
            color: '$text',
            p: '0px 4px 1px 5px',
          }}>
          <Box
            sx={{
              fontWeight: '400',
              letterSpacing: '0.03em',
              fontSize: 11,
              lineHeight: '13px',
            }}>
            {children}
          </Box>
          {loading && (
            <Box
              sx={{
                backgroundColor: '$disabled',
                ml: 5,
                position: 'relative',
                top: 0.5,
              }}>
              <Spinner
                size={12}
                loaderLineColor="$paper"
                loaderCss={{
                  background: theme.palette.$text,
                }}
                lineSize={2}
              />
            </Box>
          )}
        </Box>
      </BoxWith3D>
    </Box>
  );
}
