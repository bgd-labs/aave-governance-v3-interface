import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { BoxWith3D } from '../BoxWith3D';

interface HelpTxWrapperProps {
  txStartImage?: string;
  txEndImage?: string;
  txPending: boolean;
  txSuccess: boolean;
  children: ReactNode;
  txBlock: ReactNode;
  mobileTitle?: string;
  withTxOnMobile?: boolean;
  txStartImageMobile?: string;
  txEndImageMobile?: string;
}

export function HelpTxWrapper({
  txStartImage,
  txEndImage,
  txPending,
  txSuccess,
  children,
  txBlock,
  mobileTitle,
  withTxOnMobile,
  txStartImageMobile,
  txEndImageMobile,
}: HelpTxWrapperProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
        },
      }}>
      {!!mobileTitle && (
        <Box
          component="h2"
          sx={{
            typography: 'h1',
            mb: 24,
            [theme.breakpoints.up('sm')]: { typography: 'h1', display: 'none' },
          }}>
          {mobileTitle}
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          [theme.breakpoints.up('md')]: { order: 1 },
        }}>
        <Box
          sx={{
            display: 'none',
            [theme.breakpoints.up('md')]: {
              display: 'flex',
              width: 290,
              height: 470,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            },
          }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `url('/${
                !txPending && !txSuccess
                  ? txStartImage
                  : txPending && !txSuccess
                    ? theme.palette.mode === 'dark'
                      ? 'helpModals/txLoadingDark.svg'
                      : 'helpModals/txLoading.svg'
                    : txEndImage
              }')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </Box>

        {txStartImageMobile && txEndImageMobile && (
          <Box
            sx={(theme) => ({
              display: !withTxOnMobile ? 'block' : 'none',
              width: 210,
              height: 195,
              background: `url('/${
                !txPending && !txSuccess
                  ? txStartImageMobile
                  : txPending && !txSuccess
                    ? theme.palette.mode === 'dark'
                      ? 'helpModals/txLoadingMobileDark.svg'
                      : 'helpModals/txLoadingMobile.svg'
                    : txEndImageMobile
              }')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              mb: 20,
              [theme.breakpoints.up('sm')]: {
                display: 'none',
              },
            })}
          />
        )}

        <BoxWith3D
          contentColor="$mainLight"
          alwaysWithBorders
          borderSize={6}
          wrapperCss={{
            display: withTxOnMobile ? 'block' : 'none',
            width: 350,
            mt: 20,
            [theme.breakpoints.up('xsm')]: {
              width: 400,
            },
            [theme.breakpoints.up('sm')]: {
              display: 'block',
            },
            [theme.breakpoints.up('md')]: {
              mr: 20,
              ml: 8,
            },
            [theme.breakpoints.up('lg')]: {
              width: 450,
              mr: 30,
              ml: 14,
            },
          }}
          css={{ p: '40px 30px' }}>
          {txBlock}
        </BoxWith3D>
      </Box>

      <Box
        sx={{
          width: '100%',
          mt: 20,
          textAlign: 'center',
          order: 0,
          [theme.breakpoints.up('sm')]: {
            width: 215,
            ml: 35,
            mt: 0,
            textAlign: 'left',
          },
          [theme.breakpoints.up('md')]: {
            ml: 0,
            width: 280,
            order: 3,
          },
        }}>
        {txStartImageMobile && txEndImageMobile ? (
          <Box
            sx={{
              display: 'none',
              width: 210,
              height: 195,
              background: `url('/${
                !txPending && !txSuccess
                  ? txStartImageMobile
                  : txPending && !txSuccess
                    ? theme.palette.mode === 'dark'
                      ? 'helpModals/txLoadingMobileDark.svg'
                      : 'helpModals/txLoadingMobile.svg'
                    : txEndImageMobile
              }')`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              mb: 20,
              [theme.breakpoints.up('sm')]: {
                display: 'block',
              },
              [theme.breakpoints.up('md')]: {
                display: 'none',
              },
            }}
          />
        ) : (
          <>
            {txPending && !txSuccess && (
              <Box
                sx={{
                  display: 'none',
                  width: 210,
                  height: 195,
                  background:
                    theme.palette.mode === 'dark'
                      ? `url('/helpModals/txLoadingMobileDark.svg')`
                      : `url('/helpModals/txLoadingMobile.svg')`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  mb: 20,
                  [theme.breakpoints.up('sm')]: {
                    display: 'block',
                  },
                  [theme.breakpoints.up('md')]: {
                    display: 'none',
                  },
                }}
              />
            )}
          </>
        )}

        {children}
      </Box>
    </Box>
  );
}
