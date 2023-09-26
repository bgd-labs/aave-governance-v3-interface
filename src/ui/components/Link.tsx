import { Box, styled, SxProps } from '@mui/system';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { ReactNode, useMemo } from 'react';
import { resolve } from 'url';

import { isForIPFS } from '../../utils/appConfig';

interface LinkProps extends NextLinkProps {
  title?: string;
  href: string;
  inNewWindow?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  css?: SxProps;
}

const BaseLink = styled('a')({
  textDecoration: 'none',
});

export function Link({
  href,
  inNewWindow,
  children,
  title,
  css,
  as,
  disabled,
  ...props
}: LinkProps) {
  const isExternal =
    href.indexOf('http') === 0 || href.indexOf('mailto:') === 0;

  const newAs = useMemo(() => {
    let baseURI_as = as || href;
    if (baseURI_as.toString().startsWith('/')) {
      baseURI_as = '.' + href;
      if (typeof document !== 'undefined') {
        baseURI_as = resolve(document.baseURI, baseURI_as);
      }
    }
    return baseURI_as;
  }, [as, href]);

  return (
    <>
      {disabled ? (
        <Box
          sx={{
            color: '$text',
            typography: 'body',
            cursor: 'pointer',
            ...css,
          }}>
          {children}
        </Box>
      ) : (
        <>
          {!isExternal ? (
            <NextLink
              href={href}
              passHref
              prefetch={false}
              as={isForIPFS ? newAs : as}
              {...props}>
              <Box sx={{ color: '$text', typography: 'body', ...css }}>
                {children}
              </Box>
            </NextLink>
          ) : (
            <BaseLink
              href={href}
              rel="noreferrer"
              sx={{ color: '$text', ...css }}
              target={inNewWindow ? '_blank' : undefined}
              {...props}>
              {children}
            </BaseLink>
          )}
        </>
      )}
    </>
  );
}
