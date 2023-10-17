import { Menu } from '@headlessui/react';
import { Box, SxProps, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import SettingsIcon from '/public/images/icons/settings.svg';
import SettingsBordersIcon from '/public/images/icons/settingsBorders.svg';

import { useStore } from '../../store';
import { isForIPFS, isTermsAndConditionsVisible } from '../../utils/appConfig';
import { BoxWith3D, Divider, Link, ThemeSwitcher } from '../';
import { IconBox } from '../primitives/IconBox';
import { ROUTES } from '../utils/routes';
import { texts } from '../utils/texts';

export function SettingsButton() {
  const theme = useTheme();
  const { setIsTermModalOpen } = useStore();

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
                  '> div': {
                    '&:first-of-type': {
                      opacity: 0,
                    },
                    '&:last-of-type': {
                      opacity: 1,
                    },
                  },
                },
              }}>
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
                css={{ width: 150, p: 10, color: '$textWhite' }}>
                <Link
                  href={ROUTES.rpcSwitcher}
                  css={{
                    color: '$textDisabled',
                    lineHeight: 1,
                    hover: { color: theme.palette.$textWhite },
                    mb: 14,
                  }}
                  onClick={close}>
                  <Box sx={{ typography: 'buttonSmall' }}>
                    {texts.header.changeRPC}
                  </Box>
                </Link>
                <Box
                  component="p"
                  sx={{ typography: 'headline', color: '$textLight' }}>
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
