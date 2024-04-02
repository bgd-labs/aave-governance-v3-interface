import { Box, SxProps, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import { useRootStore } from '../../store/storeProvider';

interface BoxWith3DProps {
  children: ReactNode;
  borderSize?: number;
  contentColor?: string;
  activeContentColor?: string;
  borderLinesColor?: string;
  leftBorderColor?: string;
  bottomBorderColor?: string;
  disabled?: boolean;
  withActions?: boolean;
  wrapperCss?: SxProps;
  disableActiveState?: boolean;
  alwaysWithBorders?: boolean;
  onHeader?: boolean;
  css?: SxProps;
  className?: string;
  anySize?: boolean;
}

const isBellowFour = (value: number) => {
  if (value < 4) {
    return 4;
  } else {
    return value;
  }
};

const borderSizeVariants = (
  value: number,
  variant: 'default' | 'sm',
  anySize?: boolean,
) => {
  if (anySize) {
    return value;
  } else {
    switch (variant) {
      case 'default':
        return isBellowFour(value - 4);
      case 'sm':
        return isBellowFour(value - 2);
      default:
        return value;
    }
  }
};

function InitialBox({
  borderSize = 5,
  activeContentColor,
  contentColor,
  withActions,
  disableActiveState,
  children,
  anySize,
}: BoxWith3DProps) {
  const theme = useTheme();

  if (withActions) {
    return (
      <Box
        sx={{
          position: 'relative',
          pb: borderSizeVariants(borderSize, 'default', anySize),
          pl: borderSizeVariants(borderSize, 'default', anySize),
          [theme.breakpoints.up('sm')]: {
            pb: borderSizeVariants(borderSize, 'sm', anySize),
            pl: borderSizeVariants(borderSize, 'sm', anySize),
          },
          [theme.breakpoints.up('lg')]: {
            pb: borderSize,
            pl: borderSize,
          },
          hover: {
            '.BoxWith3D__left-shadow': {
              transition: 'all 0.15s ease',
              width: borderSizeVariants(borderSize, 'default', anySize) / 2,
              top: borderSizeVariants(borderSize, 'default', anySize) / 1.33,
              [theme.breakpoints.up('sm')]: {
                width: borderSizeVariants(borderSize, 'sm', anySize) / 2,
                top: borderSizeVariants(borderSize, 'sm', anySize) / 1.33,
              },
              [theme.breakpoints.up('lg')]: {
                width: borderSize / 2,
                top: borderSize / 1.33,
              },
            },
            '.BoxWith3D__bottom-shadow': {
              transition: 'all 0.09s ease',
              height: borderSizeVariants(borderSize, 'default', anySize) / 2,
              left:
                borderSizeVariants(borderSize, 'default', anySize) / 4 - 0.5,
              width: `calc(100% - ${borderSizeVariants(
                borderSize,
                'default',
                anySize,
              )}px + 0.5px)`,
              [theme.breakpoints.up('sm')]: {
                height: borderSizeVariants(borderSize, 'sm', anySize) / 2,
                left: borderSizeVariants(borderSize, 'sm', anySize) / 4 - 0.5,
                width: `calc(100% - ${borderSizeVariants(
                  borderSize,
                  'sm',
                  anySize,
                )}px + 0.5px)`,
              },
              [theme.breakpoints.up('lg')]: {
                height: borderSize / 2,
                left: borderSize / 4 - 0.5,
                width: `calc(100% - ${borderSize}px + 0.5px)`,
              },
            },
            '.BoxWith3D__content': {
              transform: `translate(-${
                borderSizeVariants(borderSize, 'default', anySize) / 2
              }px, ${
                borderSizeVariants(borderSize, 'default', anySize) / 2
              }px)`,
              [theme.breakpoints.up('sm')]: {
                transform: `translate(-${
                  borderSizeVariants(borderSize, 'sm', anySize) / 2
                }px, ${borderSizeVariants(borderSize, 'sm', anySize) / 2}px)`,
              },
              [theme.breakpoints.up('lg')]: {
                transform: `translate(-${borderSize / 2}px, ${
                  borderSize / 2
                }px)`,
              },
            },
          },
          '&:active': disableActiveState
            ? {}
            : {
                overflow: 'hidden',
                '.BoxWith3D__left-shadow': {
                  transition: 'all 0.15s ease',
                  width: 0,
                  top: borderSizeVariants(borderSize, 'default', anySize) + 1,
                  [theme.breakpoints.up('sm')]: {
                    top: borderSizeVariants(borderSize, 'sm', anySize) + 1,
                  },
                  [theme.breakpoints.up('lg')]: {
                    top: borderSize + 1,
                  },
                },
                '.BoxWith3D__bottom-shadow': {
                  transition: 'all 0.09s ease',
                  height: 0,
                  left: -0.5,
                },
                '.BoxWith3D__content': {
                  backgroundColor: activeContentColor
                    ? activeContentColor
                    : contentColor,
                  transform: `translate(-${borderSizeVariants(
                    borderSize,
                    'default',
                    anySize,
                  )}px, ${borderSizeVariants(
                    borderSize,
                    'default',
                    anySize,
                  )}px)`,
                  [theme.breakpoints.up('sm')]: {
                    transform: `translate(-${borderSizeVariants(
                      borderSize,
                      'default',
                      anySize,
                    )}px, ${borderSizeVariants(borderSize, 'sm', anySize)}px)`,
                  },
                  [theme.breakpoints.up('lg')]: {
                    transform: `translate(-${borderSize}px, ${borderSize}px)`,
                  },
                },
              },
        }}>
        {children}
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          position: 'relative',
          pb: borderSizeVariants(borderSize, 'default', anySize),
          pl: borderSizeVariants(borderSize, 'default', anySize),
          [theme.breakpoints.up('sm')]: {
            pb: borderSizeVariants(borderSize, 'sm', anySize),
            pl: borderSizeVariants(borderSize, 'sm', anySize),
          },
          [theme.breakpoints.up('lg')]: {
            pb: borderSize,
            pl: borderSize,
          },
        }}>
        {children}
      </Box>
    );
  }
}

export function BoxWith3D({
  borderSize = 5,
  children,
  wrapperCss,
  contentColor = '$mainStable',
  activeContentColor,
  borderLinesColor = '$mainBorder',
  leftBorderColor = '$middleLight',
  bottomBorderColor = '$light',
  disabled,
  withActions,
  disableActiveState,
  onHeader,
  css,
  className,
  anySize,
}: BoxWith3DProps) {
  const isRendered = useRootStore((store) => store.isRendered);
  const theme = useTheme();
  const isDisabled = disabled;

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
    <Box sx={wrapperCss} className={`BoxWith3D ${className}`}>
      <InitialBox
        borderSize={borderSize}
        activeContentColor={activeContentColor}
        contentColor={contentColorWithRender}
        withActions={withActions && !isDisabled}
        disableActiveState={disableActiveState}
        anySize={anySize}>
        <Box
          className="BoxWith3D__left-shadow"
          sx={{
            position: 'absolute',
            backgroundColor: leftBorderColorWithRender,
            transform: 'skewY(-45deg)',
            left: 0,
            border: `1px solid ${borderLinesColorWithRender}`,
            borderRight: 'unset !important',
            transition: 'all 0.07s ease',

            top: isDisabled
              ? borderSizeVariants(borderSize, 'default', anySize) + 0.2
              : borderSizeVariants(borderSize, 'default', anySize) / 2,
            height: `calc(100% - ${borderSizeVariants(
              borderSize,
              'default',
              anySize,
            )}px)`,
            width: isDisabled
              ? 0
              : borderSizeVariants(borderSize, 'default', anySize),
            [theme.breakpoints.up('sm')]: {
              top: isDisabled
                ? borderSizeVariants(borderSize, 'sm', anySize) + 0.2
                : borderSizeVariants(borderSize, 'sm', anySize) / 2,
              height: `calc(100% - ${borderSizeVariants(
                borderSize,
                'sm',
                anySize,
              )}px)`,
              width: isDisabled
                ? 0
                : borderSizeVariants(borderSize, 'sm', anySize),
            },
            [theme.breakpoints.up('lg')]: {
              top: isDisabled ? borderSize + 0.2 : borderSize / 2,
              height: `calc(100% - ${borderSize}px)`,
              width: isDisabled ? 0 : borderSize,
            },
          }}
        />
        <Box
          className="BoxWith3D__bottom-shadow"
          sx={{
            position: 'absolute',
            backgroundColor: bottomBorderColorWithRender,
            transform: 'skewX(-45deg)',
            bottom: 0,
            border: `1px solid ${borderLinesColorWithRender}`,
            borderTop: 'none !important',
            borderLeft: 'none !important',
            transition: 'all 0.07s ease',

            width: `calc(100% - ${borderSizeVariants(
              borderSize,
              'default',
              anySize,
            )}px)`,
            height: isDisabled
              ? 0
              : borderSizeVariants(borderSize, 'default', anySize),
            left: isDisabled
              ? 0
              : borderSizeVariants(borderSize, 'default', anySize) / 2,
            [theme.breakpoints.up('sm')]: {
              width: `calc(100% - ${borderSizeVariants(
                borderSize,
                'sm',
                anySize,
              )}px)`,
              height: isDisabled
                ? 0
                : borderSizeVariants(borderSize, 'sm', anySize),
              left: isDisabled
                ? 0
                : borderSizeVariants(borderSize, 'sm', anySize) / 2,
            },
            [theme.breakpoints.up('lg')]: {
              width: `calc(100% - ${borderSize}px)`,
              height: isDisabled ? 0 : borderSize,
              left: isDisabled ? 0 : borderSize / 2,
            },
          }}
        />

        <Box
          className="BoxWith3D__content"
          sx={{
            position: 'relative',
            zIndex: 3,
            backgroundColor: contentColorWithRender,
            transitionProperty: 'transform, width, height, background',
            transitionDuration: '0.15s',
            transitionTimingFunction: 'ease',
            width:
              isDisabled && onHeader
                ? `calc(100% + ${borderSizeVariants(
                    borderSize,
                    'default',
                    anySize,
                  )}px)`
                : '100%',

            transform: isDisabled
              ? `translate(-${borderSizeVariants(
                  borderSize,
                  'default',
                  anySize,
                )}px, ${borderSizeVariants(borderSize, 'default', anySize)}px)`
              : 'unset',
            [theme.breakpoints.up('sm')]: {
              width:
                isDisabled && onHeader
                  ? `calc(100% + ${borderSizeVariants(
                      borderSize,
                      'sm',
                      anySize,
                    )}px)`
                  : '100%',
              transform: isDisabled
                ? `translate(-${borderSizeVariants(
                    borderSize,
                    'sm',
                    anySize,
                  )}px, ${borderSizeVariants(borderSize, 'sm', anySize)}px)`
                : 'unset',
            },
            [theme.breakpoints.up('lg')]: {
              width:
                isDisabled && onHeader
                  ? `calc(100% + ${borderSize}px)`
                  : '100%',
              transform: isDisabled
                ? `translate(-${borderSize}px, ${borderSize}px)`
                : 'unset',
            },
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
