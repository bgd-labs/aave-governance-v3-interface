import { Dialog } from '@headlessui/react';
import { Box, SxProps, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import CloseIcon from '../assets/icons/cross.svg';
import { media } from '../styles/themeMUI';
import { useMediaQuery } from '../styles/useMediaQuery';
import { BackButton3D } from './BackButton3D';
import { BoxWith3D } from './BoxWith3D';
import { IconBox } from './primitives/IconBox';
import NoSSR from './primitives/NoSSR';

const ContentWrapper = ({
  children,
  maxWidth,
  contentCss,
  withMinHeight,
  minHeight,
}: {
  children: ReactNode;
  maxWidth?: number | string;
  contentCss?: SxProps;
  withMinHeight?: boolean;
  minHeight?: number;
}) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          backgroundColor: '$mainLight',
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          p: '52px 8px 24px',
          [theme.breakpoints.up('sm')]: {
            display: 'none',
          },
        }}>
        {children}
      </Box>

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
            maxWidth: maxWidth || 460,
            p: '24px 30px',
            minHeight: 'unset',
            '@media only screen and (min-height: 575px)': {
              minHeight: withMinHeight ? 500 : minHeight ? minHeight : 'unset',
            },
          },
        }}>
        <Box
          className="BasicModal__content--wrapper"
          sx={{
            width: '100%',
            minHeight: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
          <Box sx={{ width: '100%', ...contentCss }}>{children}</Box>
        </Box>
      </BoxWith3D>
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
  onBackButtonClick?: () => void;
  contentCss?: SxProps;
  modalCss?: SxProps;
  initialFocus?: any;
  withMinHeight?: boolean;
  minHeight?: number;
}

export function BasicModal({
  isOpen,
  setIsOpen,
  children,
  maxWidth,
  withCloseButton,
  withoutOverlap,
  onBackButtonClick,
  contentCss,
  modalCss,
  initialFocus,
  withMinHeight,
  minHeight,
}: BasicModalProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

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
              [theme.breakpoints.up('sm')]: {
                m: 12,
                maxWidth: maxWidth || 460,
                height: 'unset',
              },
            }}>
            <ContentWrapper
              contentCss={contentCss}
              maxWidth={maxWidth}
              withMinHeight={withMinHeight}
              minHeight={minHeight}>
              <Box
                sx={{
                  margin: 'auto',
                  width: '100%',
                  maxWidth: maxWidth || 460,
                  [theme.breakpoints.up('sm')]: {
                    margin: '0 auto',
                    maxWidth: 'unset',
                  },
                }}>
                {children}
              </Box>

              {!!onBackButtonClick && (
                <Box
                  sx={{ position: 'absolute', top: 14, left: 8, zIndex: 12 }}>
                  <Box sx={{ position: 'fixed' }}>
                    <BackButton3D
                      onClick={onBackButtonClick}
                      alwaysWithBorders
                      isSmall={sm}
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
                    right: 8,
                    top: 10,
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
