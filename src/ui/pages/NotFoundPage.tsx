'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';

import { BackButton3D } from '../components/BackButton3D';
import { BigButton } from '../components/BigButton';
import { Link } from '../components/Link';
import { NoDataWrapper } from '../components/NoDataWrapper';
import { Container } from '../primitives/Container';
import NoSSR from '../primitives/NoSSR';
import { ROUTES } from '../utils/routes';
import { texts } from '../utils/texts';

export function NotFoundPage() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Container>
      <Box sx={{ display: 'flex', [theme.breakpoints.up('sm')]: { mb: 12 } }}>
        <BackButton3D onClick={router.back} />
      </Box>

      <NoDataWrapper>
        <Box sx={{ maxWidth: 444, m: '0 auto' }}>
          <NoSSR>
            {theme.palette.mode === 'dark' ? (
              <img
                width="100%"
                height="auto"
                src="/404/404Dark.svg"
                alt={`404 - ${texts.meta.notFoundPageMetaTitle}`}
              />
            ) : (
              <img
                width="100%"
                height="auto"
                src="/404/404.svg"
                alt={`404 - ${texts.meta.notFoundPageMetaTitle}`}
              />
            )}
          </NoSSR>
        </Box>
        <Box component="h1" sx={{ typography: 'h1', mt: 8 }}>
          {texts.notFoundPage.title}
        </Box>
        <Box
          component="p"
          sx={{ typography: 'body', mt: 12, mb: 20, maxWidth: 480 }}>
          {texts.notFoundPage.descriptionFirst}
          <br />
          {texts.notFoundPage.descriptionSecond}
        </Box>
        <Link href={ROUTES.main}>
          <BigButton>{texts.notFoundPage.buttonTitle}</BigButton>
        </Link>
      </NoDataWrapper>
    </Container>
  );
}
