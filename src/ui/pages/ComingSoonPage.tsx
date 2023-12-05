'use client';

import { Box, useTheme } from '@mui/system';

import { Container } from '../primitives/Container';

export function ComingSoonPage() {
  const theme = useTheme();

  return (
    <Container>
      <Box
        className="ComingSoonPage"
        sx={{
          mt: 24,
          width: '100%',
          height: 480,
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'url(/images/ComingF_Mob_dark.svg)'
              : 'url(/images/ComingF_Mob_light.svg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          [theme.breakpoints.up('sm')]: {
            backgroundImage:
              theme.palette.mode === 'dark'
                ? 'url(/images/ComingF_Dark.svg)'
                : 'url(/images/ComingF_Light.svg)',
            height: 340,
          },
          [theme.breakpoints.up('md')]: {
            height: 420,
          },
          [theme.breakpoints.up('lg')]: {
            height: 480,
          },
        }}
      />
    </Container>
  );
}
