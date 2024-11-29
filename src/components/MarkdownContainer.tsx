import { Box, useTheme } from '@mui/system';
import React from 'react';
import Markdown from 'react-markdown';
import { Prism } from 'react-syntax-highlighter';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';

import { Link } from './Link';
import { Image } from './primitives/Image';

interface MarkdownContainerProps {
  markdown: string;
  replaceImgSrc?: string;
}

export function MarkdownContainer({
  markdown,
  replaceImgSrc,
}: MarkdownContainerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        wordBreak: 'break-word',
        'h1, h2, h3, h4, h5, h6': {
          fontWeight: '600 !important',
        },
        h1: {
          mt: '2em',
          mb: '4px',
        },
        h2: {
          mt: '1.5em',
          mb: '4px',
        },
        'h3, h4, h5, h6': {
          mt: '1em',
          mb: '4px',
        },
        table: {
          th: {
            p: 12,
            borderBottomColor: '$main',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
          },
          td: {
            p: 12,
            borderBottomColor: '$main',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            textAlign: 'center',
          },
        },
        pre: {
          mt: '1.5em',
          mb: '4px',
          overflowX: 'auto',
        },
        code: {
          p: 4,
          font: '12px Monaco,Consolas,"Andale  Mono","DejaVu Sans Mono",monospace',
        },
        hr: {
          border: 'unset',
          borderTop: `1px solid ${theme.palette.$textSecondary}`,
          my: '1em',
        },
        em: {
          color: theme.palette.$textSecondary,
        },
      }}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkGemoji]}
        components={{
          img({ src: _src, alt }) {
            if (!_src) return null;
            const src =
              /^\.\.\//.test(_src) && replaceImgSrc
                ? _src.replace('../', replaceImgSrc)
                : _src;
            return (
              <Image
                src={src}
                alt={alt}
                sx={{
                  display: 'block',
                  maxWidth: '100%',
                  mt: '1em',
                  mx: 'auto',
                  height: 'auto',
                }}
              />
            );
          },
          a({ children, ...rest }) {
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
                {children}
              </Link>
            );
          },
          h1({ children }) {
            return (
              <Box component="h2" sx={{ typography: 'h1' }}>
                {children}
              </Box>
            );
          },
          h2({ children }) {
            return (
              <Box component="h3" sx={{ typography: 'h2' }}>
                {children}
              </Box>
            );
          },
          h3({ children }) {
            return (
              <Box component="h4" sx={{ typography: 'h3' }}>
                {children}
              </Box>
            );
          },
          p({ children }) {
            return (
              <Box
                component="p"
                sx={{
                  typography: 'body',
                  mb: 4,
                  mt: '0.5em',
                }}>
                {children}
              </Box>
            );
          },
          ul({ children }) {
            return (
              <Box
                component="ul"
                sx={{
                  typography: 'body',
                  mb: '0.75em',
                  pl: 30,
                  listStyleType: 'disc',
                }}>
                {children}
              </Box>
            );
          },
          ol({ children }) {
            return (
              <Box
                component="ol"
                sx={{
                  typography: 'body',
                  mb: '0.75em',
                }}>
                {children}
              </Box>
            );
          },
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              <Prism
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={
                  theme.palette.mode === 'dark'
                    ? // eslint-disable-next-line @typescript-eslint/no-var-requires
                      require('react-syntax-highlighter/dist/esm/styles/prism')
                        .materialOceanic
                    : // eslint-disable-next-line @typescript-eslint/no-var-requires
                      require('react-syntax-highlighter/dist/esm/styles/prism')
                        .materialLight
                }
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <Box sx={{ width: '100%', pb: 12, overflowX: 'auto' }}>
                <Box
                  component="table"
                  sx={{
                    width: '100%',
                    pb: 12,
                    '*': {
                      wordBreak: 'keep-all',
                    },
                  }}>
                  {children}
                </Box>
              </Box>
            );
          },
        }}>
        {markdown}
      </Markdown>
    </Box>
  );
}
