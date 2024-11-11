import { Box, useTheme } from '@mui/system';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import WarningIcon from '../../assets/icons/warningIcon.svg';
import Logo from '../../assets/logo.svg';
import {
  isForIPFS,
  isTermsAndConditionsVisible,
} from '../../configs/appConfig';
import { ROUTES } from '../../configs/routes';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { selectIsRpcAppHasErrors } from '../../store/selectors/rpcSwitcherSelectors';
import { media } from '../../styles/themeMUI';
import { useClickOutside } from '../../styles/useClickOutside';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { useScrollDirection } from '../../styles/useScrollDirection';
import { BoxWith3D } from '../BoxWith3D';
import { Link } from '../Link';
import { Container } from '../primitives/Container';
import { Divider } from '../primitives/Divider';
import { IconBox } from '../primitives/IconBox';
import NoSSR from '../primitives/NoSSR';
import { WalletWidget } from '../Web3/wallet/WalletWidget';
import { AppModeSwitcher } from './AppModeSwitcher';
import { SettingsButton } from './SettingsButton';
import { ThemeSwitcher } from './ThemeSwitcher';

const headerNavItems = [
  {
    link: 'https://snapshot.org/#/aave.eth',
    title: texts.header.navSnapshots,
  },
  {
    link: 'https://governance.aave.com/',
    title: texts.header.navForum,
  },
  {
    link: 'https://docs.aave.com/faq/governance',
    title: texts.header.navTutorial,
  },
];

export function AppHeader() {
  const theme = useTheme();
  const path = usePathname();

  const sm = useMediaQuery(media.sm);
  const wrapperRef = useRef(null);

  const isRendered = useStore((store) => store.isRendered);
  const activeWallet = useStore((store) => store.activeWallet);
  const checkAppMode = useStore((store) => store.checkAppMode);
  const appMode = useStore((store) => store.appMode);
  const isAppBlockedByTerms = useStore((store) => store.isAppBlockedByTerms);
  const isModalOpen = useStore((store) => store.isModalOpen);
  const setIsTermModalOpen = useStore((store) => store.setIsTermModalOpen);
  const isClickedOnStartButtonOnHelpModal = useStore(
    (store) => store.isClickedOnStartButtonOnHelpModal,
  );
  const isRpcHasError = useStore((store) => selectIsRpcAppHasErrors(store));

  const { scrollDirection } = useScrollDirection();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenMobileMenu = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    setMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
    setMobileMenuOpen(false);
  };

  useClickOutside({
    ref: wrapperRef,
    outsideClickFunc: () => setTimeout(() => handleCloseMobileMenu(), 10),
    additionalCondition: mobileMenuOpen,
  });

  useEffect(() => {
    checkAppMode();
  }, [activeWallet?.isActive]);

  useEffect(() => {
    if (sm) {
      handleCloseMobileMenu();
    }
  }, [sm]);

  if (appMode === 'default') {
    if (headerNavItems.some((item) => item.title === 'Create')) {
      headerNavItems.shift();
    }
  } else {
    if (!headerNavItems.some((item) => item.title === 'Create')) {
      headerNavItems.unshift({
        link: ROUTES.create,
        title: texts.header.navCreate,
      });
    }
  }

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top:
            scrollDirection === 'down'
              ? isModalOpen || isAppBlockedByTerms
                ? 0
                : -82
              : 0,
          pt: mobileMenuOpen ? 0 : 8,
          pb: mobileMenuOpen ? 0 : 8,
          zIndex: 110,
          mb: 10,
          backgroundColor: isRendered
            ? `${theme.palette.$paper} !important`
            : theme.palette.$paper,
          transition: mobileMenuOpen ? 'all 0.2s ease' : 'all 0.5s ease',
          [theme.breakpoints.up('sm')]: {
            position: 'relative',
            backgroundColor: 'transparent !important',
            pt: mobileMenuOpen ? 0 : 12,
            pb: 0,
            top: 0,
            zIndex: 90,
            mb: 24,
          },
        }}>
        <Container
          sx={{
            paddingLeft: mobileMenuOpen ? 0 : 8,
            paddingRight: mobileMenuOpen ? 0 : 8,
            transition: 'padding 0.2s ease',
            overflow: 'hidden',
            [theme.breakpoints.up('sm')]: {
              paddingLeft: 24,
              paddingRight: 24,
              overflow: 'unset',
            },
          }}>
          <BoxWith3D
            className="Header_content"
            borderSize={10}
            leftBorderColor="$secondary"
            bottomBorderColor="$headerGray"
            onHeader={!sm}
            disabled={mobileMenuOpen}
            wrapperCss={{
              backgroundColor: mobileMenuOpen
                ? isRendered
                  ? `${theme.palette.$mainStable} !important`
                  : theme.palette.$mainStable
                : isRendered
                  ? `${theme.palette.$paper} !important`
                  : theme.palette.$paper,
              '> div': {
                left: mobileMenuOpen ? 3 : 0,
                bottom: mobileMenuOpen ? 3 : 0,
              },
            }}
            css={{
              p: '4px 8px 4px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 52,
              borderColor: mobileMenuOpen
                ? 'transparent !important'
                : `${theme.palette.$mainBorder} !important`,
              [theme.breakpoints.up('md')]: {
                p: '4px 14px 4px 24px',
              },
              [theme.breakpoints.up('lg')]: {
                p: '8px 20px 8px 30px',
                height: 66,
              },
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link
                href={ROUTES.main}
                // onClick={() => setActivePage(0)}
                disabled={path === ROUTES.main}
                css={{
                  lineHeight: 0,
                  transform: 'translate(0)',
                  hover: { opacity: 0.7 },
                  [theme.breakpoints.up('sm')]: {
                    mr: 15,
                  },
                  [theme.breakpoints.up('lg')]: {
                    mr: 20,
                  },
                }}>
                <IconBox
                  sx={{
                    width: 59,
                    height: 26,
                    [theme.breakpoints.up('lg')]: {
                      width: 80,
                      height: 35,
                    },
                    '> svg': {
                      width: 59,
                      height: 26,
                      [theme.breakpoints.up('lg')]: {
                        width: 80,
                        height: 35,
                      },
                    },
                  }}>
                  <Logo />
                </IconBox>
              </Link>

              <Box
                sx={{
                  display: 'none',
                  [theme.breakpoints.up('sm')]: {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}>
                {headerNavItems.map((item) => (
                  <React.Fragment key={item.title}>
                    {item.title === texts.header.navTutorial ? (
                      <Box
                        component="button"
                        // onClick={() => {
                        //   closeHelpModals();
                        //   setIsHelpModalOpen(true);
                        // }}
                        sx={{
                          typography: 'buttonSmall',
                          color: '$textLight',
                          mr: 15,
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          fontWeight: '300',
                          fontSize: 13,
                          lineHeight: '15px',
                          [theme.breakpoints.up('lg')]: {
                            mr: 25,
                            fontSize: 15,
                            lineHeight: '18px',
                          },
                          hover: {
                            opacity: '0.7',
                          },
                        }}>
                        <Box
                          component="p"
                          className="Header__navItem"
                          sx={{
                            typography: 'buttonSmall',
                            color: isRendered
                              ? `${theme.palette.$textLight} !important`
                              : theme.palette.$textLight,
                          }}>
                          {item.title}
                        </Box>

                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            opacity:
                              isClickedOnStartButtonOnHelpModal || !isRendered
                                ? 0
                                : 1,
                            zIndex: 100,
                            position: 'absolute',
                            top: -3,
                            right: -8,
                            transform: 'scale(0.8)',
                            borderRadius: '50%',
                            backgroundColor: '$error',
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        component={Link}
                        href={item.link}
                        inNewWindow
                        sx={{
                          color: '$textLight',
                          mr: 15,
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          fontWeight: '300',
                          fontSize: 13,
                          lineHeight: '15px',
                          [theme.breakpoints.up('lg')]: {
                            mr: 25,
                            fontSize: 15,
                            lineHeight: '18px',
                          },
                          hover: {
                            opacity: '0.7',
                          },
                        }}>
                        <Box
                          component="p"
                          className="Header__navItem"
                          sx={{
                            typography: 'buttonSmall',
                            color: isRendered
                              ? `${theme.palette.$textLight} !important`
                              : theme.palette.$textLight,
                          }}>
                          {item.title}
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>

            <NoSSR>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WalletWidget />
                <SettingsButton setIsTermModalOpen={setIsTermModalOpen} />

                <Box
                  sx={{
                    position: 'relative',
                    [theme.breakpoints.up('sm')]: {
                      display: 'none',
                    },
                  }}
                  component="button"
                  type="button"
                  onClick={() => {
                    if (mobileMenuOpen) {
                      handleCloseMobileMenu();
                    } else {
                      handleOpenMobileMenu();
                    }
                  }}>
                  <Box
                    sx={{
                      p: 10,
                      display: 'inline-block',
                      transitionProperty: 'opacity, filter',
                      transitionDuration: '0.15s',
                      transitionTimingFunction: 'linear',
                      overflow: 'visible',
                      position: 'relative',
                      zIndex: 21,
                      hover: {
                        opacity: 0.7,
                      },
                      '.hamburger-box': {
                        width: 17,
                        height: 16,
                        display: 'inline-block',
                        position: 'relative',
                      },
                      '.hamburger-inner, .hamburger-inner:before, .hamburger-inner:after':
                        {
                          width: 17,
                          height: 2,
                          backgroundColor: '$textWhite',
                          position: 'absolute',
                          transitionProperty: 'transform',
                          transitionDuration: '0.15s',
                          transitionTimingFunction: 'ease',
                        },
                      '.hamburger-inner': {
                        display: 'block',
                        mt: -2,
                        top: 2,
                        transition: 'background-color 0s 0.13s linear',
                        transitionDelay: mobileMenuOpen ? '0.22s' : '0.13s',
                        backgroundColor: mobileMenuOpen
                          ? 'transparent !important'
                          : '$textWhite',
                        '&:before, &:after': {
                          content: `''`,
                          display: 'block',
                        },
                        '&:before': {
                          top: mobileMenuOpen ? 0 : 8,
                          transition: mobileMenuOpen
                            ? 'top 0.1s 0.15s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1)'
                            : 'top 0.1s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)',
                          transform: mobileMenuOpen
                            ? 'translate3d(0, 8px, 0) rotate(45deg)'
                            : 'unset',
                        },
                        '&:after': {
                          top: mobileMenuOpen ? 0 : 16,
                          transition: mobileMenuOpen
                            ? 'top 0.2s cubic-bezier(0.33333, 0, 0.66667, 0.33333), transform 0.13s 0.22s cubic-bezier(0.215, 0.61, 0.355, 1)'
                            : 'top 0.2s 0.2s cubic-bezier(0.33333, 0.66667, 0.66667, 1), transform 0.13s cubic-bezier(0.55, 0.055, 0.675, 0.19)',
                          transform: mobileMenuOpen
                            ? 'translate3d(0, 8px, 0) rotate(-45deg)'
                            : 'unset',
                        },
                      },
                    }}>
                    <span className="hamburger-box">
                      <span className="hamburger-inner" />
                    </span>
                  </Box>

                  {isRpcHasError && !mobileMenuOpen && (
                    <IconBox
                      sx={{
                        position: 'absolute',
                        zIndex: 105,
                        bottom: 6,
                        right: 6,
                        width: 12,
                        height: 10,
                        '> svg': {
                          width: 12,
                          height: 10,
                        },
                      }}>
                      <WarningIcon />
                    </IconBox>
                  )}
                </Box>
              </Box>
            </NoSSR>
          </BoxWith3D>
        </Container>
      </Box>

      <NoSSR>
        <Box
          ref={wrapperRef}
          sx={{
            display: 'block',
            transition: 'transform 0.4s ease',
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 109,
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(150px)',
            width: mobileMenuOpen ? 180 : 0,
            height: '100%',
            overflowY: 'auto',
            [theme.breakpoints.up('sm')]: { display: 'none' },
          }}>
          <Box
            sx={{
              height: '100%',
              '> div, .BoxWith3D__content': {
                height: '100%',
                '@media only screen and (max-height: 370px)': {
                  height: 'unset',
                },
              },
            }}>
            <Box
              sx={{
                backgroundColor: '$mainStable',
                p: '85px 15px 15px',
                height: '100%',
              }}>
              {headerNavItems.map((item) => (
                <React.Fragment key={item.title}>
                  {item.title === texts.header.navTutorial ? (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        // TODO
                        // closeHelpModals();
                        // setIsTermModalOpen(false);
                        // setIsHelpModalOpen(true);
                        handleCloseMobileMenu();
                      }}
                      sx={{
                        color: '$textLight',
                        mb: 15,
                        display: 'block',
                      }}>
                      <Box
                        component="p"
                        sx={{ typography: 'body', color: '$textLight' }}>
                        {item.title}
                      </Box>
                    </Box>
                  ) : (
                    <Link
                      href={item.link}
                      onClick={() => handleCloseMobileMenu()}
                      inNewWindow={item.title !== 'Create'}
                      css={{
                        color: '$textLight',
                        mb: 14,
                        display: 'block',
                      }}>
                      <Box
                        component="p"
                        sx={{ typography: 'body', color: '$textLight' }}>
                        {item.title}
                      </Box>
                    </Link>
                  )}
                </React.Fragment>
              ))}
              <Link
                href={ROUTES.adi}
                inNewWindow
                onClick={() => handleCloseMobileMenu()}
                css={{
                  color: '$textLight',
                  mb: 14,
                  display: 'block',
                }}>
                <Box
                  component="p"
                  sx={{
                    typography: 'body',
                  }}>
                  {texts.header.adi}
                </Box>
              </Link>
              <Link
                href={ROUTES.payloadsExplorer}
                onClick={() => handleCloseMobileMenu()}
                css={{
                  color: '$textLight',
                  mb: 14,
                  display: 'block',
                }}>
                <Box
                  component="p"
                  sx={{
                    typography: 'body',
                  }}>
                  {texts.header.payloadsExplorer}
                </Box>
              </Link>
              <Link
                href={ROUTES.rpcSwitcher}
                onClick={() => handleCloseMobileMenu()}
                css={{
                  color: '$textLight',
                  mb: 14,
                  display: 'block',
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="p"
                    sx={{
                      typography: 'body',
                      color: isRpcHasError ? '$error' : '$textLight',
                    }}>
                    {texts.header.changeRPC}
                  </Box>
                  {isRpcHasError && (
                    <IconBox
                      sx={{
                        width: 12,
                        height: 10,
                        ml: 4,
                        '> svg': {
                          width: 12,
                          height: 10,
                        },
                      }}>
                      <WarningIcon />
                    </IconBox>
                  )}
                </Box>
              </Link>
              {!isForIPFS && isTermsAndConditionsVisible && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    // TODO
                    // closeHelpModals();
                    // setIsTermModalOpen(true);
                    handleCloseMobileMenu();
                  }}
                  sx={{
                    textAlign: 'left',
                    color: '$textLight',
                    mb: 14,
                    display: 'block',
                  }}>
                  <Box sx={{ typography: 'body' }}>
                    {texts.header.termsAndConditions}
                  </Box>
                </Box>
              )}

              <AppModeSwitcher />

              <Box
                sx={{
                  color: '$textLight',
                  whiteSpace: 'nowrap',
                  mt: 28,
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}>
                  <Box component="p" sx={{ typography: 'headline' }}>
                    {texts.header.theme}
                  </Box>
                </Box>
                <Divider sx={{ mt: 8, mb: 16 }} />
                <ThemeSwitcher />
              </Box>
            </Box>
          </Box>
        </Box>

        {mobileMenuOpen && (
          <Box
            sx={{
              position: 'fixed',
              backgroundColor: '$backgroundOverlap',
              inset: 0,
              zIndex: 100,
            }}
            aria-hidden="true"
          />
        )}
      </NoSSR>
    </>
  );
}
