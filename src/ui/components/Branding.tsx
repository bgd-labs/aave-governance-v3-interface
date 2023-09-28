import { Box, useTheme } from '@mui/system';

import XIcon from '/public/images/icons/twitterX.svg';
import WebIcon from '/public/images/icons/web.svg';

import { IconBox } from '../primitives/IconBox';
import { Link } from './Link';

const brandingLinks = [
  {
    href: 'https://twitter.com/bgdlabs',
    icon: XIcon,
  },
  {
    href: 'https://bgdlabs.com',
    icon: WebIcon,
  },
];

export function Branding() {
  const theme = useTheme();

  return (
    <Box
      className="Branding"
      sx={{
        mt: 28,
        position: 'relative',
        zIndex: 2,
        [theme.breakpoints.up('sm')]: {
          mt: 40,
        },
      }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          [theme.breakpoints.up('sm')]: { flexDirection: 'row' },
        }}>
        <Box
          className="Branding__text"
          sx={{
            typography: 'body',
            color: '$textDisabled',
            [theme.breakpoints.up('sm')]: { mr: 6 },
          }}>
          by BGD Labs
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 10,
            [theme.breakpoints.up('sm')]: { mt: 0 },
          }}>
          {brandingLinks.map((link, index) => (
            <Link
              href={link.href}
              inNewWindow
              key={index}
              css={{
                transition: 'all 0.2s ease',
                ml: 10,
                '&:first-of-type': {
                  ml: 0,
                },
                [theme.breakpoints.up('sm')]: { ml: 6 },
                hover: {
                  '.Branding__icon': {
                    svg: {
                      path: {
                        fill: theme.palette.$text,
                      },
                    },
                  },
                },
              }}>
              <IconBox
                className="Branding__icon"
                sx={{
                  width: 20,
                  height: 20,
                  [theme.breakpoints.up('sm')]: {
                    width: 14,
                    height: 14,
                  },
                  '> svg': {
                    width: 20,
                    height: 20,
                    transition: 'all 0.2s ease',
                    path: {
                      fill: theme.palette.$textDisabled,
                    },
                    [theme.breakpoints.up('sm')]: {
                      width: 14,
                      height: 14,
                    },
                  },
                }}>
                {link.icon()}
              </IconBox>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
