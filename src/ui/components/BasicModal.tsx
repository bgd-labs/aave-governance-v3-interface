import { Dialog } from '@headlessui/react';
import { Box, SxProps, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import CloseIcon from '/public/images/icons/cross.svg';

import { IconBox } from '../primitives/IconBox';
import NoSSR from '../primitives/NoSSR';
import { BackButton3D } from './BackButton3D';
import { BoxWith3D } from './BoxWith3D';

const ContentWrapper = ({
  children,
  maxWidth,
  contentCss,
}: {
  children: ReactNode;
  maxWidth?: number | string;
  contentCss?: SxProps;
}) => {
  const theme = useTheme();

  return (
    <>
      <BoxWith3D
        borderSize={10}
        contentColor="$mainLight"
        alwaysWithBorders
        wrapperCss={{
          display: 'none',
          width: '100%',
          height: '100%',
          [theme.breakpoints.up('sm')]: {
            display: 'flex',
          },
          '> div': { width: '100%', height: '100%', display: 'flex' },
        }}
        css={{
          [theme.breakpoints.up('sm')]: {
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'auto',
            width: '100%',
            display: 'block',
            maxHeight: 'calc(100vh - 20px)',
            height: 'unset',
            maxWidth: maxWidth || 450,
            p: '24px 30px',
          },
        }}>
        <Box sx={contentCss}>{children}</Box>
      </BoxWith3D>

      <Box
        sx={{
          backgroundColor: '$mainLight',
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          p: '24px 8px',
          [theme.breakpoints.up('sm')]: {
            display: 'none',
          },
        }}>
        {children}
      </Box>
    </>
  );
};

export interface BasicModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: ReactNode;
  maxWidth?: number | string;
  withCloseButton?: boolean;
  withoutOverlap?: boolean;
  withoutAnimationWhenOpen?: boolean;
  onBackButtonClick?: () => void;
  contentCss?: SxProps;
  modalCss?: SxProps;
  initialFocus?: any;
}

export function BasicModal({
  isOpen,
  setIsOpen,
  children,
  maxWidth,
  withCloseButton,
  withoutOverlap,
  withoutAnimationWhenOpen,
  onBackButtonClick,
  contentCss,
  modalCss,
  initialFocus,
}: BasicModalProps) {
  const theme = useTheme();

  return (
    <NoSSR>
      <Dialog
        initialFocus={initialFocus}
        as={Box}
        sx={{
          position: 'relative',
          zIndex: 102,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          ...modalCss,
        }}
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}>
        {!withoutOverlap && (
          <Box
            sx={{
              position: 'fixed',
              backgroundColor: '$backgroundOverlap',
              inset: 0,
            }}
            aria-hidden="true"
          />
        )}

        <Box
          sx={{
            display: 'flex',
            position: 'fixed',
            top: 70,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            [theme.breakpoints.up('sm')]: {
              top: 0,
            },
          }}>
          <Dialog.Panel
            as={Box}
            sx={{
              width: '100%',
              height: '100%',
              '@keyframes modalOpen': {
                '0%': {
                  opacity: withoutAnimationWhenOpen ? 1 : 0.5,
                },
                '100%': {
                  opacity: 1,
                },
              },
              '@media (hover: hover) and (pointer: fine)': {
                animation: `modalOpen 0.3s`,
              },
              [theme.breakpoints.up('sm')]: {
                m: 12,
                maxWidth: maxWidth || 450,
                height: 'unset',
              },
            }}>
            <ContentWrapper contentCss={contentCss} maxWidth={maxWidth}>
              <Box
                sx={{
                  margin: 'auto',
                  width: '100%',
                  maxWidth: maxWidth || 450,
                  [theme.breakpoints.up('sm')]: {
                    margin: '0 auto',
                    maxWidth: 'unset',
                  },
                }}>
                {children}
              </Box>

              {!!onBackButtonClick && (
                <Box
                  sx={{ position: 'absolute', top: 10, left: 15, zIndex: 12 }}>
                  <Box sx={{ position: 'fixed' }}>
                    <BackButton3D
                      onClick={onBackButtonClick}
                      alwaysWithBorders
                      isSmall
                      isVisibleOnMobile
                      alwaysVisible
                    />
                  </Box>
                </Box>
              )}

              {withCloseButton && (
                <Box
                  sx={{
                    position: 'absolute',
                    zIndex: 12,
                    height: 30,
                    width: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: 5,
                    top: 2,
                    border: 'none',
                    background: 'none',
                    lineHeight: 0,
                    hover: {
                      opacity: '0.7',
                    },
                    [theme.breakpoints.up('sm')]: {
                      top: 5,
                    },
                  }}
                  component="button"
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                  }}>
                  <IconBox
                    sx={{
                      position: 'fixed',
                      height: 16,
                      width: 16,
                      '> svg': {
                        height: 16,
                        width: 16,
                      },
                      path: {
                        stroke: theme.palette.$main,
                        fill: theme.palette.$main,
                      },
                    }}>
                    <CloseIcon />
                  </IconBox>
                </Box>
              )}
            </ContentWrapper>
          </Dialog.Panel>
        </Box>
      </Dialog>
    </NoSSR>
  );
}
