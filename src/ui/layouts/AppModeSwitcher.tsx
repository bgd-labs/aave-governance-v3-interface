import { Box, useTheme } from '@mui/system';
import React from 'react';

import { useRootStore } from '../../store/storeProvider';
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

  const activeWallet = useRootStore((store) => store.activeWallet);
  const appMode = useRootStore((store) => store.appMode);
  const setAppMode = useRootStore((store) => store.setAppMode);
  const closeHelpModals = useRootStore((store) => store.closeHelpModals);
  const setIsTermModalOpen = useRootStore((store) => store.setIsTermModalOpen);
  const setIsHelpModalOpen = useRootStore((store) => store.setIsHelpModalOpen);

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
                  cursor: appMode === mode.mode ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  [theme.breakpoints.up('sm')]: {
                    color: '$textDisabled',
                  },
                  hover: {
                    color:
                      appMode === mode.mode
                        ? theme.palette.$textDisabled
                        : theme.palette.$textWhite,
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
