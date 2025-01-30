import { Box, useTheme } from '@mui/system';
import { useEffect, useState } from 'react';

import ToTopArrow from '../assets/icons/toTopArrow.svg';
import { BoxWith3D } from './BoxWith3D';
import { IconBox } from './primitives/IconBox';

export function ToTopButton() {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 400) {
      setVisible(true);
    } else if (scrolled <= 400) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', toggleVisible);
    }
    return () =>
      typeof window !== 'undefined'
        ? window.removeEventListener('scroll', toggleVisible)
        : undefined;
  }, []);

  return (
    <Box
      component="button"
      type="button"
      onClick={scrollToTop}
      sx={{
        display: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.3s ease',
        position: 'fixed',
        zIndex: 10,
        [theme.breakpoints.up('sm')]: {
          display: 'block',
          right: 15,
          bottom: 20,
        },
        [theme.breakpoints.up('md')]: {
          bottom: 40,
          right: '5%',
        },
        [theme.breakpoints.up('lg')]: {
          bottom: 60,
        },
      }}>
      <BoxWith3D
        withActions
        borderSize={10}
        leftBorderColor="$secondary"
        bottomBorderColor="$headerGray"
        css={{
          display: 'inline-flex',
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <IconBox
          sx={{
            width: 19,
            height: 19,
            '> svg': {
              width: 19,
              height: 19,
            },
            path: { fill: theme.palette.$textLight },
          }}>
          <ToTopArrow />
        </IconBox>
      </BoxWith3D>
    </Box>
  );
}
