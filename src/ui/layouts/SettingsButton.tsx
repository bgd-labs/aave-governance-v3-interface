import { Menu } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React from 'react';

import SettingsIcon from '/public/images/icons/settings.svg';
import SettingsBordersIcon from '/public/images/icons/settingsBorders.svg';

import { useStore } from '../../store';
import { isForIPFS } from '../../utils/appConfig';
import { BoxWith3D, Divider, ThemeSwitcher } from '../';
import { IconBox } from '../primitives/IconBox';
import { texts } from '../utils/texts';

export function SettingsButton() {
  const theme = useTheme();
  const { setIsTermModalOpen } = useStore();

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
                <Box
                  component="p"
                  sx={{ typography: 'headline', color: '$textLight' }}>
                  {texts.header.theme}
                </Box>
                <Divider sx={{ my: 10 }} />
                <ThemeSwitcher />
                {!isForIPFS && (
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
