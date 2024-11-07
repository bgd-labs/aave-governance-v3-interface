import { Box, useTheme } from '@mui/system';
import React from 'react';

import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { AppModeType } from '../../types';
import { Divider } from '../primitives/Divider';

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
