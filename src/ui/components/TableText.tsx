import { Box } from '@mui/system';
import { ethers } from 'ethers';
import React, { ReactNode, useState } from 'react';
import { CopyToClipboard as CTC } from 'react-copy-to-clipboard';

import { useStore } from '../../store';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useMediaQuery } from '../utils/useMediaQuery';

interface TableTextProps {
  children: ReactNode;
  topText: string;
  address?: string;
  isCrossed?: boolean;
  alwaysGray?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isErrorOnRight?: boolean;
  removeHover?: boolean;
}
export function TableText({
  topText,
  children,
  address,
  isCrossed,
  alwaysGray,
  isError,
  isErrorOnRight,
  errorMessage,
  removeHover,
}: TableTextProps) {
  const store = useStore();
  const sm = useMediaQuery(media.sm);
  const [isClick, setIsClick] = useState(false);

  const isActionsAvailable = !isCrossed && !isError && !alwaysGray;

  return (
    <Box
      onClick={() => {
        if (isActionsAvailable) {
          setIsClick(true);
          setTimeout(() => setIsClick(false), 1000);
        }
      }}
      sx={(theme) => ({
        typography: 'h3',
        display: 'inline-flex',
        fontWeight: 600,
        textDecoration: isCrossed ? 'line-through' : 'unset',
        mb: isCrossed ? 12 : 0,
        color: isError
          ? '$error'
          : alwaysGray || isCrossed
          ? '$textDisabled'
          : '$text',
        [theme.breakpoints.up('sm')]: {
          mb: isCrossed ? 0 : 0,
        },
        [theme.breakpoints.up('md')]: {
          mb: isCrossed ? 12 : 0,
        },
        hover: removeHover
          ? {}
          : {
              '.TableText__hovered': {
                display:
                  isActionsAvailable && !isClick && sm ? 'block' : 'none',
              },
              '.TableText__content': {
                display:
                  isActionsAvailable && !isClick && sm && !!address
                    ? 'none'
                    : 'inline-flex',
              },
            },
      })}>
      {address === ethers.constants.AddressZero ||
      address === store.activeWallet?.accounts[0] ? (
        topText
      ) : (
        <>
          {isClick && !!address && !removeHover ? (
            <Box
              component="h3"
              sx={(theme) => ({
                typography: 'body',
                backgroundColor: '$disabled',
                position: 'relative',
                px: 5,
                py: 1,
                [theme.breakpoints.up('md')]: {
                  typography: 'h3',
                  p: 5,
                  top: 1,
                },
              })}>
              {texts.other.copied}
            </Box>
          ) : (
            <>
              {!!address && (
                <Box className="TableText__hovered" sx={{ display: 'none' }}>
                  <CTC text={address}>
                    <Box
                      component="p"
                      sx={(theme) => ({
                        typography: 'body',
                        backgroundColor: '$light',
                        position: 'relative',
                        cursor: isActionsAvailable ? 'pointer' : 'default',
                        px: 5,
                        py: 1,
                        [theme.breakpoints.up('md')]: {
                          typography: 'h3',
                          p: 5,
                          top: 1,
                        },
                      })}>
                      {address}
                    </Box>
                  </CTC>
                </Box>
              )}

              <Box
                className="TableText__content"
                sx={(theme) => ({
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  [theme.breakpoints.up('md')]: {
                    alignItems: isErrorOnRight ? 'flex-end' : 'center',
                  },
                })}>
                <Box sx={{ display: 'inline-flex' }}>{children}</Box>

                {isError && (
                  <Box
                    component="p"
                    sx={{
                      typography: 'descriptor',
                      mt: 2,
                      position: 'relative',
                      color: '$error',
                    }}>
                    {errorMessage}
                  </Box>
                )}
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}
