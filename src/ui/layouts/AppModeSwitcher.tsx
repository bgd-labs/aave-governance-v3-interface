import { Box, useTheme } from '@mui/system';
import React from 'react';

import { useStore } from '../../store';
import { Divider } from '../primitives/Divider';
import { AppModeType } from '../store/uiSlice';
import { texts } from '../utils/texts';

export const appModes: { mode: AppModeType; title: string }[] = [
  {
    mode: 'default',
    title: texts.header.appModeDefault,
  },
  {
    mode: 'dev',
    title: texts.header.appModeDev,
  },
  {
    mode: 'expert',
    title: texts.header.appModeExpert,
  },
];

export function AppModeSwitcher() {
  const theme = useTheme();

  const activeWallet = useStore((store) => store.activeWallet);
  const appMode = useStore((store) => store.appMode);
  const setAppMode = useStore((store) => store.setAppMode);
  const closeHelpModals = useStore((store) => store.closeHelpModals);
  const setIsTermModalOpen = useStore((store) => store.setIsTermModalOpen);
  const setIsHelpModalOpen = useStore((store) => store.setIsHelpModalOpen);

  return (
    <>
      {!activeWallet?.isContractAddress && (
        <Box sx={{ mt: 8, mb: 14 }}>
          <Box sx={{ typography: 'headline', color: '$textLight' }}>
            {texts.header.appMode}
          </Box>
          <Divider sx={{ my: 14 }} />
          {appModes.map((mode) => {
            return (
              <Box
                key={mode.mode}
                component="button"
                type="button"
                onClick={() => {
                  closeHelpModals();
                  setIsTermModalOpen(false);
                  setIsHelpModalOpen(false);
                  setAppMode(mode.mode);
                }}
                sx={{
                  mb: 12,
                  display: 'block',
                  color: '$textLight',
                  transition: 'all 0.2s ease',
                  [theme.breakpoints.up('sm')]: {
                    color: '$textDisabled',
                  },
                  hover: {
                    color: theme.palette.$textWhite,
                  },
                }}>
                <Box
                  component="p"
                  sx={{
                    typography: 'buttonSmall',
                    fontWeight: appMode === mode.mode ? 600 : 400,
                  }}>
                  {mode.title}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );
}
