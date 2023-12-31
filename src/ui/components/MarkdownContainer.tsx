import { Box } from '@mui/system';
import Markdown from 'markdown-to-jsx';
import { Highlight, Prism, themes } from 'prism-react-renderer';
import React from 'react';

import { Image } from '../primitives/Image';
import { Link } from './Link';
import { TextWithEmoji } from './TextWithEmoji';

interface MarkdownContainerProps {
  markdown: string;
  replaceImgSrc?: string;
}

const loadLang = async (langSlug: string) => {
  (typeof global !== 'undefined' ? global : window).Prism = Prism;
  // @ts-ignore
  await import(`prismjs/components/prism-${langSlug}`);
};

export function MarkdownContainer({
  markdown,
  replaceImgSrc,
}: MarkdownContainerProps) {
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
          p: 12,
          my: 18,
          borderRadius: '5px',
          borderColor: '$main',
          borderWidth: '1px',
          borderStyle: 'solid',
          backgroundColor: '$light',
          font: '12px Monaco,Consolas,"Andale  Mono","DejaVu Sans Mono",monospace',
          overflowX: 'auto',
        },
        code: {
          p: 4,
          font: '12px Monaco,Consolas,"Andale  Mono","DejaVu Sans Mono",monospace',
        },
      }}>
      <Markdown
        options={{
          wrapper: 'article',
          overrides: {
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
                  <TextWithEmoji>{rest.children}</TextWithEmoji>
                </Link>
              );
            },
            h1({ node, ...rest }) {
              return (
                <Box component="h2" sx={{ typography: 'h2', my: 18 }}>
                  <TextWithEmoji>{rest.children}</TextWithEmoji>
                </Box>
              );
            },
            h2({ node, ...rest }) {
              return (
                <Box component="h3" sx={{ typography: 'headline', my: 18 }}>
                  <TextWithEmoji>{rest.children}</TextWithEmoji>
                </Box>
              );
            },
            h3({ node, ...rest }) {
              return (
                <Box component="h4" sx={{ typography: 'headline' }}>
                  <TextWithEmoji>{rest.children}</TextWithEmoji>
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
                  }}>
                  <TextWithEmoji>{rest.children}</TextWithEmoji>
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
                    listStyleType: 'disc',
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
                  }}>
                  {rest.children}
                </Box>
              );
            },
            pre: async ({ node, ...rest }) => {
              const langSlug = rest.children.props.className.split('-')[1];
              await loadLang(langSlug);

              return (
                <Highlight
                  theme={themes.github}
                  code={rest.children.props.children}
                  language={langSlug}>
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre style={style}>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          <span>{i + 1}</span>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              );
            },
            table({ node, ...rest }) {
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
                    {rest.children}
                  </Box>
                </Box>
              );
            },
          },
        }}>
        {markdown}
      </Markdown>
    </Box>
  );
}
