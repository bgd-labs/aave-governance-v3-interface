import { ProposalMetadata } from '@bgd-labs/aave-governance-ui-helpers/src';
import { Box, useTheme } from '@mui/system';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { BoxWith3D, Image, Link } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { texts } from '../../../ui/utils/texts';

interface DetailsProps {
  ipfs?: ProposalMetadata;
  ipfsError?: string;
}

export function Details({ ipfs, ipfsError }: DetailsProps) {
  const theme = useTheme();

  if (!ipfs && !ipfsError)
    return (
      <>
        <Box sx={{ mb: 16 }}>
          <Box sx={{ mb: 8 }}>
            <CustomSkeleton width={100} height={16} />
          </Box>
          <CustomSkeleton height={16} />
        </Box>

        <CustomSkeleton count={20} height={19} />
      </>
    );

  if (!ipfs && ipfsError)
    return (
      <BoxWith3D
        wrapperCss={{ my: 12 }}
        borderSize={10}
        contentColor="$mainAgainst"
        css={{ p: '15px 20px' }}>
        <Box
          component="p"
          sx={{
            color: '$light',
            fontSize: 12,
            lineHeight: '15px',
            textAlign: 'center',
          }}>
          {ipfsError}
        </Box>
      </BoxWith3D>
    );

  return (
    <Box
      sx={{
        wordBreak: 'break-word',
        'h1, h2, h3, h4, h5, h6': { my: 12 },
        table: {
          width: '100%',
          th: {
            p: 10,
            borderBottomColor: '$main',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
          },
          td: {
            p: 10,
            borderBottomColor: '$main',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            textAlign: 'center',
          },
        },
        pre: {
          p: 10,
          my: 12,
          borderRadius: '5px',
          borderColor: '$main',
          borderWidth: '1px',
          borderStyle: 'solid',
          backgroundColor: '$light',
          font: '12px Monaco,Consolas,"Andale  Mono","DejaVu Sans Mono",monospace',
          overflowX: 'auto',
        },
        code: {
          p: 2,
          font: '12px Monaco,Consolas,"Andale  Mono","DejaVu Sans Mono",monospace',
        },
      }}>
      <Box sx={{ mb: 16 }}>
        <Box component="p" sx={{ typography: 'headline', mb: 12 }}>
          {texts.proposals.author}
        </Box>
        <Box component="p" sx={{ typography: 'body' }}>
          {ipfs?.author}
        </Box>
      </Box>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img({ src: _src, alt }) {
            if (!_src) return null;
            const src = /^\.\.\//.test(_src)
              ? _src.replace(
                  '../',
                  'https://raw.githubusercontent.com/aave/aip/main/content/',
                )
              : _src;
            return (
              <Image
                src={src}
                alt={alt}
                sx={{
                  display: 'block',
                  maxWidth: '100%',
                  mt: 8,
                  mx: 'auto',
                  height: 'auto',
                }}
              />
            );
          },
          a({ node, ...rest }) {
            return (
              <Link
                href={rest.href || ''}
                css={{
                  color: '$textSecondary',
                  textDecoration: 'underline',
                  wordBreak: 'break-word',
                  hover: { textDecoration: 'none' },
                }}
                inNewWindow>
                {rest.children}
              </Link>
            );
          },
          h1({ node, ...rest }) {
            return (
              <Box
                component="h3"
                sx={{ typography: 'h3', my: 12, fontWeight: 600 }}>
                {rest.children}
              </Box>
            );
          },
          h2({ node, ...rest }) {
            return (
              <Box component="p" sx={{ typography: 'headline', my: 12 }}>
                {rest.children}
              </Box>
            );
          },
          p({ node, ...rest }) {
            return (
              <Box
                component="p"
                sx={{
                  typography: 'body',
                  mb: 8,
                  lineHeight: '15px !important',
                  [theme.breakpoints.up('lg')]: {
                    typography: 'body',
                    lineHeight: '22px !important',
                  },
                }}>
                {rest.children}
              </Box>
            );
          },
          ul({ node, ...rest }) {
            return (
              <Box
                component="ul"
                sx={{
                  typography: 'body',
                  mb: 12,
                  pl: 30,
                  lineHeight: '15px !important',
                  listStyleType: 'disc',
                  [theme.breakpoints.up('lg')]: {
                    typography: 'body',
                    lineHeight: '22px !important',
                  },
                }}>
                {rest.children}
              </Box>
            );
          },
          ol({ node, ...rest }) {
            return (
              <Box
                component="ol"
                sx={{
                  typography: 'body',
                  mb: 12,
                  pl: 30,
                  lineHeight: '15px !important',
                  [theme.breakpoints.up('lg')]: {
                    typography: 'body',
                    lineHeight: '22px !important',
                  },
                }}>
                {rest.children}
              </Box>
            );
          },
        }}>
        {ipfs?.description || ''}
      </ReactMarkdown>
    </Box>
  );
}
