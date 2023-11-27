import { Box } from '@mui/system';
import React, { ReactNode, useState } from 'react';
import { CopyToClipboard as CTC } from 'react-copy-to-clipboard';
import { isAddress, zeroAddress } from 'viem';

import { useStore } from '../../store';
import { texts } from '../utils/texts';
import { media } from '../utils/themeMUI';
import { useMediaQuery } from '../utils/useMediaQuery';

interface TableTextProps {
  children: ReactNode;
  topText?: string;
  value?: string;
  isCrossed?: boolean;
  alwaysGray?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isErrorOnRight?: boolean;
  withoutHover?: boolean;
}
export function TableText({
  topText,
  children,
  value,
  isCrossed,
  alwaysGray,
  isError,
  isErrorOnRight,
  errorMessage,
  withoutHover,
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
        typography: 'h2',
        display: 'inline-flex',
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
        hover: withoutHover
          ? {}
          : {
              '.TableText__hovered': {
                display:
                  isActionsAvailable && !isClick && sm ? 'block' : 'none',
              },
              '.TableText__content': {
                display:
                  isActionsAvailable && !isClick && sm && !!value
                    ? 'none'
                    : 'inline-flex',
              },
            },
      })}>
      {value &&
      isAddress(value) &&
      topText &&
      (value === zeroAddress || value === store.activeWallet?.address) ? (
        topText
      ) : (
        <>
          {isClick && !!value && !withoutHover ? (
            <Box
              component="h3"
              sx={(theme) => ({
                typography: 'body',
                lineHeight: '1 !important',
                backgroundColor: '$disabled',
                position: 'relative',
                px: 5,
                py: 1,
                [theme.breakpoints.up('md')]: {
                  typography: 'h3',
                  p: '2px 5px',
                  top: 1,
                },
              })}>
              {texts.other.copied}
            </Box>
          ) : (
            <>
              {!!value && (
                <Box className="TableText__hovered" sx={{ display: 'none' }}>
                  <CTC text={value}>
                    <Box
                      component="p"
                      sx={(theme) => ({
                        typography: 'body',
                        lineHeight: '1 !important',
                        backgroundColor: '$light',
                        position: 'relative',
                        cursor: isActionsAvailable ? 'pointer' : 'default',
                        px: 5,
                        py: 1,
                        [theme.breakpoints.up('md')]: {
                          typography: 'h3',
                          p: '2px 5px',
                          top: 1,
                        },
                      })}>
                      {value}
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
                <Box
                  sx={{
                    display: 'inline-flex',
                    '*': { wordBreak: 'break-word' },
                  }}>
                  {children}
                </Box>

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
