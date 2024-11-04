import { Menu } from '@headlessui/react';
import { Box, SxProps, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import SettingsIcon from '/public/images/icons/settings.svg';
import SettingsBordersIcon from '/public/images/icons/settingsBorders.svg';
import WarningIcon from '/public/images/icons/warningIcon.svg';

import { selectIsRpcAppHasErrors } from '../../rpcSwitcher/store/rpcSwitcherSelectors';
import { useStore } from '../../store/ZustandStoreProvider';
import { isForIPFS, isTermsAndConditionsVisible } from '../../utils/appConfig';
import { BoxWith3D, Divider, Link, ThemeSwitcher } from '../';
import { IconBox } from '../primitives/IconBox';
import { ROUTES } from '../utils/routes';
import { textCenterEllipsis } from '../utils/text-center-ellipsis';
import { texts } from '../utils/texts';
import { AppModeSwitcher } from './AppModeSwitcher';

export function SettingsButton() {
  const theme = useTheme();

  const setIsTermModalOpen = useStore((store) => store.setIsTermModalOpen);
  const rpcAppErrors = useStore((store) => store.rpcAppErrors);
  const isRpcHasError = useStore((store) => selectIsRpcAppHasErrors(store));

  const filteredAppErrors = Object.values(rpcAppErrors).filter(
    (error) => error.error,
  );

  const SettingButtonIconWrapper = ({
    children,
    sx,
  }: {
    children: ReactNode;
    sx: SxProps;
  }) => {
    return (
      <IconBox
        sx={{
          width: 16,
          height: 16,
          transition: 'all 0.2s ease',
          path: {
            stroke: theme.palette.$textLight,
          },
          ...sx,
          '> svg': {
            width: 16,
            height: 16,
            [theme.breakpoints.up('lg')]: {
              width: 22,
              height: 22,
            },
          },
          [theme.breakpoints.up('lg')]: {
            width: 22,
            height: 22,
          },
        }}>
        {children}
      </IconBox>
    );
  };

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
                display: 'flex',
                alignItems: 'center',
                px: 10,
                ml: 2,
                height: 52,
                [theme.breakpoints.up('lg')]: {
                  ml: 8,
                  height: 66,
                },
                hover: {
                  '.SettingsButton__rpc--error': {
                    opacity: 1,
                  },
                  'div > div': {
                    '&:first-of-type': {
                      opacity: 0,
                    },
                    '&:nth-of-type(2)': {
                      opacity: 1,
                    },
                  },
                },
              }}>
              <Box sx={{ position: 'relative' }}>
                <SettingButtonIconWrapper
                  sx={{
                    opacity: open ? 0 : 1,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                  <SettingsBordersIcon />
                </SettingButtonIconWrapper>
                <SettingButtonIconWrapper
                  sx={{
                    opacity: open ? 1 : 0,
                  }}>
                  <SettingsIcon />
                </SettingButtonIconWrapper>

                {isRpcHasError && (
                  <>
                    <IconBox
                      sx={{
                        position: 'absolute',
                        right: -3,
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
              </Box>
            </Menu.Button>

            <Menu.Items
              as={Box}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                right: 0,
                top: 'calc(100% - 1px)',
              }}>
              <BoxWith3D
                borderSize={10}
                leftBorderColor="$secondary"
                bottomBorderColor="$headerGray"
                css={{
                  width: 170,
                  p: 10,
                  color: '$textWhite',
                  [theme.breakpoints.up('lg')]: { width: 190 },
                }}>
                <Link
                  href={ROUTES.adi}
                  inNewWindow
                  css={{
                    display: 'inline-block',
                    color: '$textDisabled',
                    lineHeight: 1,
                    hover: {
                      color: theme.palette.$textWhite,
                    },
                    mb: 15,
                  }}
                  onClick={close}>
                  <Box sx={{ typography: 'buttonSmall' }}>
                    {texts.header.adi}
                  </Box>
                </Link>

                <Link
                  href={ROUTES.payloadsExplorer}
                  css={{
                    display: 'inline-block',
                    color: '$textDisabled',
                    lineHeight: 1,
                    hover: {
                      color: theme.palette.$textWhite,
                    },
                    mb: 15,
                  }}
                  onClick={close}>
                  <Box sx={{ typography: 'buttonSmall' }}>
                    {texts.header.payloadsExplorer}
                  </Box>
                </Link>

                <Link
                  href={ROUTES.rpcSwitcher}
                  css={{
                    display: 'inline-block',
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

                <AppModeSwitcher />

                <Box
                  component="p"
                  sx={{
                    display: 'block',
                    typography: 'headline',
                    color: '$textLight',
                  }}>
                  {texts.header.theme}
                </Box>
                <Divider sx={{ mt: 8, mb: 14 }} />
                <ThemeSwitcher />
                {!isForIPFS && isTermsAndConditionsVisible && (
                  <>
                    <Divider sx={{ my: 14 }} />
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
