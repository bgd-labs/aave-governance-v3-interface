import { Box, useTheme } from '@mui/system';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import Logo from '/src/assets/logo.svg';

import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ROUTES } from '../../routes';
import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { useScrollDirection } from '../../styles/useScrollDirection';
import { BoxWith3D } from '../BoxWith3D';
import { Link } from '../Link';
import { Container } from '../primitives/Container';
import { IconBox } from '../primitives/IconBox';

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

  const isRendered = useStore((store) => store.isRendered);
  const appMode = useStore((store) => store.appMode);

  const { scrollDirection } = useScrollDirection();

  const [mobileMenuOpen] = useState(false);

  if (appMode === 'default') {
    if (headerNavItems.some((item) => item.title === 'Create')) {
      headerNavItems.shift();
    }
  } else {
    if (!headerNavItems.some((item) => item.title === 'Create')) {
      headerNavItems.unshift({
        link: '/create',
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
          // top:
          //   scrollDirection === 'down'
          //     ? isModalOpen || isAppBlockedByTerms
          //       ? 0
          //       : -82
          //     : 0,
          top: scrollDirection === 'down' ? -82 : 0,
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
                              // isClickedOnStartButtonOnHelpModal || !isRendered
                              //   ? 0
                              //   : 1,
                              1,
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
          </BoxWith3D>
        </Container>
      </Box>
    </>
  );
}
