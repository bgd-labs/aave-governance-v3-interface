'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';

import { ROUTES } from '../../configs/routes';
import { metaTexts } from '../../helpers/texts/metaTexts';
import { texts } from '../../helpers/texts/texts';
import { BackButton3D } from '../BackButton3D';
import { BigButton } from '../BigButton';
import { Link } from '../Link';
import { NoDataWrapper } from '../NoDataWrapper';
import { Container } from '../primitives/Container';
import NoSSR from '../primitives/NoSSR';

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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                width="100%"
                height="auto"
                src="/404/404Dark.svg"
                alt={`404 - ${metaTexts.notFoundPageMetaTitle}`}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                width="100%"
                height="auto"
                src="/404/404.svg"
                alt={`404 - ${metaTexts.notFoundPageMetaTitle}`}
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
