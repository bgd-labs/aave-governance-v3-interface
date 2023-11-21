import { Menu } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React from 'react';

import SettingsIcon from '/public/images/icons/settings.svg';
import SettingsBordersIcon from '/public/images/icons/settingsBorders.svg';
import WarningIcon from '/public/images/icons/warningIcon.svg';

import { selectIsRpcAppHasErrors } from '../../rpcSwitcher/store/rpcSwitcherSelectors';
import { useStore } from '../../store';
import { isForIPFS, isTermsAndConditionsVisible } from '../../utils/appConfig';
import { BoxWith3D, Divider, Link, ThemeSwitcher } from '../';
import { IconBox } from '../primitives/IconBox';
import { ROUTES } from '../utils/routes';
import { textCenterEllipsis } from '../utils/text-center-ellipsis';
import { texts } from '../utils/texts';

export function SettingsButton() {
  const theme = useTheme();
  const store = useStore();
  const { setIsTermModalOpen, rpcAppErrors } = store;

  const isRpcHasError = selectIsRpcAppHasErrors(store);

  const filteredAppErrors = Object.values(rpcAppErrors).filter(
    (error) => error.error,
  );

  return (
    <>
      <Menu
        as={Box}
        sx={{
          display: 'none',
          [theme.breakpoints.up('sm')]: { display: 'block' },
        }}>
        {({ open, close }) => (
          <>
            <Menu.Button
              as={Box}
              sx={{
                cursor: 'pointer',
                lineHeight: '0.5',
                position: 'relative',
                px: 10,
                [theme.breakpoints.up('lg')]: {
                  ml: 10,
                },
                hover: {
                  '.SettingsButton__rpc--error': {
                    opacity: 1,
                  },
                  '> div': {
                    '&:first-of-type': {
                      opacity: 0,
                    },
                    '&:nth-of-type(2)': {
                      opacity: 1,
                    },
                  },
                },
              }}>
              <IconBox
                sx={{
                  width: 16,
                  height: 16,
                  opacity: open ? 0 : 1,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 0.2s ease',
                  path: {
                    stroke: theme.palette.$textLight,
                  },
                  '> svg': {
                    width: 16,
                    height: 16,
                    [theme.breakpoints.up('lg')]: {
                      width: 21,
                      height: 21,
                    },
                  },
                  [theme.breakpoints.up('lg')]: {
                    width: 21,
                    height: 21,
                  },
                }}>
                <SettingsBordersIcon />
              </IconBox>
              <IconBox
                sx={{
                  width: 16,
                  height: 16,
                  opacity: open ? 1 : 0,
                  transition: 'all 0.2s ease',
                  path: {
                    fill: theme.palette.$textLight,
                  },
                  '> svg': {
                    width: 16,
                    height: 16,
                    [theme.breakpoints.up('lg')]: {
                      width: 21,
                      height: 21,
                    },
                  },
                  [theme.breakpoints.up('lg')]: {
                    width: 21,
                    height: 21,
                  },
                }}>
                <SettingsIcon />
              </IconBox>

              {isRpcHasError && (
                <>
                  <IconBox
                    sx={{
                      position: 'absolute',
                      right: 7,
                      bottom: -3,
                      width: 10,
                      height: 8,
                      '> svg': {
                        width: 10,
                        height: 8,
                        [theme.breakpoints.up('lg')]: {
                          width: 12,
                          height: 10,
                        },
                      },
                      [theme.breakpoints.up('lg')]: {
                        width: 12,
                        height: 10,
                        right: 6,
                        bottom: -3,
                      },
                    }}>
                    <WarningIcon />
                  </IconBox>

                  <Box
                    className="SettingsButton__rpc--error"
                    sx={{
                      padding: 4,
                      typography: 'descriptor',
                      backgroundColor: '$light',
                      position: 'absolute',
                      top: -16,
                      right: 'calc(100% - 6px)',
                      minWidth: 250,
                      zIndex: 6,
                      opacity: 0,
                      transition: 'all 0.2s ease',
                      pointerEvents: 'none',
                      [theme.breakpoints.up('lg')]: {
                        padding: 8,
                        top: -18,
                      },
                    }}>
                    {texts.other.rpcError(
                      filteredAppErrors.length,
                      textCenterEllipsis(filteredAppErrors[0].rpcUrl, 12, 12),
                    )}
                  </Box>
                </>
              )}
            </Menu.Button>

            <Menu.Items
              as={Box}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                right: 0,
                top: '100%',
              }}>
              <BoxWith3D
                borderSize={10}
                leftBorderColor="$secondary"
                bottomBorderColor="$headerGray"
                css={{ width: 150, p: 10, color: '$textWhite' }}>
                <Link
                  href={ROUTES.rpcSwitcher}
                  css={{
                    color: isRpcHasError ? '$error' : '$textDisabled',
                    lineHeight: 1,
                    hover: {
                      color: isRpcHasError
                        ? theme.palette.$error
                        : theme.palette.$textWhite,
                    },
                    mb: 15,
                  }}
                  onClick={close}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ typography: 'buttonSmall' }}>
                      {texts.header.changeRPC}
                    </Box>
                    {isRpcHasError && (
                      <IconBox
                        sx={{
                          width: 10,
                          height: 8,
                          ml: 4,
                          '> svg': {
                            width: 10,
                            height: 8,
                            [theme.breakpoints.up('lg')]: {
                              width: 12,
                              height: 10,
                            },
                          },
                          [theme.breakpoints.up('lg')]: {
                            width: 12,
                            height: 10,
                          },
                        }}>
                        <WarningIcon />
                      </IconBox>
                    )}
                  </Box>
                </Link>
                <Box
                  component="p"
                  sx={{ typography: 'headline', color: '$textLight' }}>
                  {texts.header.theme}
                </Box>
                <Divider sx={{ my: 10 }} />
                <ThemeSwitcher />
                {!isForIPFS && isTermsAndConditionsVisible && (
                  <>
                    <Divider sx={{ my: 10 }} />
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        close();
                        setIsTermModalOpen(true);
                      }}
                      sx={{
                        textAlign: 'left',
                        color: '$textDisabled',
                        hover: {
                          color: theme.palette.$textWhite,
                        },
                      }}>
                      <Box sx={{ typography: 'buttonSmall' }}>
                        {texts.header.termsAndConditions}
                      </Box>
                    </Box>
                  </>
                )}
              </BoxWith3D>
            </Menu.Items>
          </>
        )}
      </Menu>
    </>
  );
}
