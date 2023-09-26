import { Menu } from '@headlessui/react';
import { Box, styled, useTheme } from '@mui/system';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';

import ArrowToLeft from '/public/images/icons/arrowToLeft.svg';
import ArrowToRight from '/public/images/icons/arrowToRight.svg';

import { ProposalStateForFilter } from '../../proposals/utils/statuses';
import { IconBox } from '../primitives/IconBox';
import { BoxWith3D } from './BoxWith3D';

export interface FilterDropdownProps {
  statuses: ProposalStateForFilter[];
  selectedStatus: number | null;
  setSelectedStatus: (value: number | null) => void;
  disabled?: boolean;
}

const MenuItem = styled('div')(({ theme }) => ({
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  color: theme.palette.$textDisabled,
  cursor: 'pointer',
  marginLeft: 7,
  marginRight: 7,
  background: 'transparent',
  '&:hover': {
    color: theme.palette.$text,
    [theme.breakpoints.up('sm')]: {
      color: theme.palette.$textWhite,
    },
  },
  '&:first-of-type': {
    marginLeft: 10,
  },
  '&:last-of-type': {
    marginRight: 14,
  },
}));

export function FilterDropdown({
  statuses,
  selectedStatus,
  setSelectedStatus,
  disabled,
}: FilterDropdownProps) {
  const theme = useTheme();
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(false);

  useEffect(() => {
    setIsAnimationEnabled(false);
    return () => setIsAnimationEnabled(false);
  }, []);

  const mobileScrollingWrapper = useRef(null);

  useEffect(() => {
    if (mobileScrollingWrapper && mobileScrollingWrapper.current) {
      if (selectedStatus === 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mobileScrollingWrapper.current.scrollLeft = 0;
      } else if (selectedStatus === null) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        mobileScrollingWrapper.current.scrollLeft =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          mobileScrollingWrapper.current.scrollWidth;
      }
    }
  }, [mobileScrollingWrapper, selectedStatus]);

  return (
    <>
      <Menu
        as={Box}
        sx={{
          position: 'relative',
          display: 'none',
          alignItems: 'center',
          overflow: 'hidden',
          [theme.breakpoints.up('sm')]: { display: 'flex', overflow: 'unset' },
        }}>
        {({ open, close }) => (
          <>
            <Box
              sx={{
                position: 'relative',
                zIndex: -1,
                opacity: 0,
                pl: 15,
                maxWidth: 220,
                display: 'flex',
                [theme.breakpoints.up('sm')]: {
                  maxWidth: 'unset',
                },
              }}>
              {statuses.map((status) => (
                <MenuItem key={status.value}>
                  <Box
                    component="p"
                    sx={{
                      typography: 'buttonSmall',
                      lineHeight: 1,
                      letterSpacing: '0.03em',
                    }}>
                    {status.title}
                  </Box>
                </MenuItem>
              ))}
            </Box>

            <Menu.Button
              as={Box}
              disabled={disabled}
              onClick={() => !disabled && setIsAnimationEnabled(true)}
              sx={{
                zIndex: open ? -1 : 0,
                opacity: open ? 0 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}>
              <BoxWith3D
                borderSize={10}
                leftBorderColor="$secondary"
                bottomBorderColor="$headerGray"
                disabled={disabled}
                css={{
                  '@keyframes menuClose': {
                    '0%': {
                      width: 300,
                    },
                    '100%': {
                      width: 130,
                    },
                  },

                  transition: 'all 0.1s ease',
                  width: 130,
                  height: 32,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  animation:
                    !open && isAnimationEnabled ? `menuClose 0.3s` : '',
                  hover: {
                    width: disabled ? 130 : 158,
                  },
                  [theme.breakpoints.up('lg')]: {
                    height: 36,
                  },
                }}>
                {!disabled && (
                  <IconBox
                    sx={{
                      position: 'absolute',
                      zIndex: 2,
                      left: 6,
                      width: 7,
                      height: 12,
                      '> svg': {
                        width: 7,
                        height: 12,
                      },
                      path: {
                        transition: 'all 0.2s ease',
                        stroke: theme.palette.$textWhite,
                      },
                    }}>
                    <ArrowToLeft />
                  </IconBox>
                )}

                <Box
                  sx={{
                    position: 'relative',
                    width: 128,
                    textAlign: 'center',
                    zIndex: 2,
                  }}>
                  <Box
                    component="p"
                    className="MenuButton__text"
                    sx={{
                      typography: 'h3',
                      transition: 'all 0.1s ease',
                      lineHeight: 1,
                      letterSpacing: '0.03em',
                      color: '$textWhite',
                    }}>
                    {
                      statuses.find((status) => status.value === selectedStatus)
                        ?.title
                    }
                  </Box>
                </Box>
              </BoxWith3D>
            </Menu.Button>

            <Menu.Items
              as={Box}
              sx={{
                '@keyframes menuOpen': {
                  '0%': {
                    width: 158,
                  },
                  '100%': {
                    width: 'calc(100% - 115px)',
                  },
                },

                maxWidth: '100%',
                overflowX: 'auto',
                [theme.breakpoints.up('sm')]: {
                  animation: `menuOpen 0.5s`,
                  maxWidth: 'unset',
                  overflowX: 'hidden',
                  position: 'absolute',
                  zIndex: 2,
                  right: 0,
                  top: 0,
                },
              }}>
              <BoxWith3D
                borderSize={10}
                leftBorderColor="$secondary"
                bottomBorderColor="$headerGray"
                css={{
                  height: 32,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pl: 30,
                  transition: 'all 0.1s ease',
                  [theme.breakpoints.up('lg')]: {
                    height: 36,
                  },
                }}>
                <Box
                  onClick={() => {
                    close();
                  }}
                  sx={{
                    position: 'absolute',
                    zIndex: 2,
                    left: 7,
                    width: 15,
                    height: 20,
                    p: 4,
                    display: 'inline-block',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    lineHeight: 0,

                    hover: {
                      path: { stroke: theme.palette.$textSecondary },
                    },
                  }}>
                  <IconBox
                    sx={{
                      width: 7,
                      height: 12,
                      '> svg': {
                        width: 7,
                        height: 12,
                      },
                      path: {
                        transition: 'all 0.2s ease',
                        stroke: theme.palette.$textWhite,
                      },
                    }}>
                    <ArrowToRight />
                  </IconBox>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    position: 'relative',
                    zIndex: 2,
                    alignItems: 'center',
                  }}>
                  {statuses.map((status) => (
                    <Menu.Item
                      key={status.value}
                      as={MenuItem}
                      onClick={(e: MouseEvent<HTMLDivElement>) => {
                        e.preventDefault();
                        selectedStatus !== status.value &&
                          setSelectedStatus(status.value);
                      }}
                      sx={{
                        cursor:
                          selectedStatus === status.value
                            ? 'default'
                            : 'pointer',
                        color:
                          selectedStatus === status.value
                            ? '$textWhite'
                            : '$textDisabled',
                      }}>
                      <Box
                        component="p"
                        sx={{
                          typography: 'buttonSmall',
                          lineHeight: 1,
                          letterSpacing: '0.03em',
                          fontWeight:
                            selectedStatus === status.value ? '600' : '300',
                        }}>
                        {status.title}
                      </Box>
                    </Menu.Item>
                  ))}
                </Box>
              </BoxWith3D>
            </Menu.Items>
          </>
        )}
      </Menu>

      {!disabled && (
        <Box
          ref={mobileScrollingWrapper}
          sx={{
            display: 'flex',
            maxWidth: '100%',
            overflowX: 'auto',
            pb: 15,
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          {statuses.map((status) => (
            <Box
              key={status.value}
              component={MenuItem}
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                e.target.scrollIntoView({ inline: 'center' });
                selectedStatus !== status.value &&
                  setSelectedStatus(status.value);
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'auto' });
                }
              }}
              sx={{
                cursor: selectedStatus === status.value ? 'default' : 'pointer',
                color:
                  selectedStatus === status.value ? '$text' : '$textDisabled',
              }}>
              <Box
                component="p"
                sx={{
                  typography: 'h3',
                  lineHeight: 1,
                  fontWeight: selectedStatus === status.value ? '600' : '300',
                }}>
                {status.title}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
