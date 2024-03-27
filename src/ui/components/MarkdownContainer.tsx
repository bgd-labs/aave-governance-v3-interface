import { Box, useTheme } from '@mui/system';
import React from 'react';
import Markdown from 'react-markdown';
import { Prism } from 'react-syntax-highlighter';
import remarkGemoji from 'remark-gemoji';
import remarkGfm from 'remark-gfm';

import { Image } from '../primitives/Image';
import { Link } from './Link';

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
        'h1, h2, h3, h4, h5, h6': { my: 18 },
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
          my: 18,
          overflowX: 'auto',
        },
        code: {
          p: 4,
          font: '12px Monaco,Consolas,"Andale  Mono","DejaVu Sans Mono",monospace',
        },
        hr: {
          my: 18,
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
                  mt: 12,
                  mx: 'auto',
                  height: 'auto',
                }}
              />
            );
          },
          a({ children, className, node, ...rest }) {
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
          h1({ children, className, node, ...rest }) {
            return (
              <Box component="h2" sx={{ typography: 'h2', my: 18 }}>
                {children}
              </Box>
            );
          },
          h2({ children, className, node, ...rest }) {
            return (
              <Box component="h3" sx={{ typography: 'headline', my: 18 }}>
                {children}
              </Box>
            );
          },
          h3({ children, className, node, ...rest }) {
            return (
              <Box component="h4" sx={{ typography: 'headline' }}>
                {children}
              </Box>
            );
          },
          p({ children, className, node, ...rest }) {
            return (
              <Box
                component="p"
                sx={{
                  typography: 'body',
                  mb: 8,
                }}>
                {children}
              </Box>
            );
          },
          ul({ children, className, node, ...rest }) {
            return (
              <Box
                component="ul"
                sx={{
                  typography: 'body',
                  mb: 12,
                  pl: 30,
                  listStyleType: 'disc',
                }}>
                {children}
              </Box>
            );
          },
          ol({ children, className, node, ...rest }) {
            return (
              <Box
                component="ol"
                sx={{
                  typography: 'body',
                  mb: 12,
                }}>
                {children}
              </Box>
            );
          },
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              // @ts-ignore
              <Prism
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={
                  theme.palette.mode === 'dark'
                    ? require('react-syntax-highlighter/dist/esm/styles/prism')
                        .materialOceanic
                    : require('react-syntax-highlighter/dist/esm/styles/prism')
                        .materialLight
                }
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
          table({ children, className, node, ...rest }) {
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
