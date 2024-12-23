import { Box, useTheme } from '@mui/system';
import { ReactNode } from 'react';

interface HelpModalCaptionProps {
  caption: string;
  image: ReactNode;
  children: ReactNode;
  withoutMargin?: boolean;
}

export function HelpModalCaption({
  caption,
  image,
  children,
  withoutMargin,
}: HelpModalCaptionProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mb: withoutMargin ? 0 : 16,
        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          alignItems: 'center',
          textAlign: 'left',
          justifyContent: 'center',
        },
        [theme.breakpoints.up('md')]: { mb: withoutMargin ? 0 : 18 },
        [theme.breakpoints.up('lg')]: { mb: withoutMargin ? 0 : 32 },
      }}>
      <Box
        component="h2"
        sx={{
          typography: 'h1',
          mb: 24,
          [theme.breakpoints.up('sm')]: { typography: 'h1', display: 'none' },
        }}>
        {caption}
      </Box>

      <Box
        sx={{
          mr: 0,
          [theme.breakpoints.up('sm')]: { mr: 20 },
        }}>
        {image}
      </Box>

      <Box>
        <Box
          sx={{
            typography: 'h1',
            display: 'none',
            mb: 12,
            [theme.breakpoints.up('sm')]: {
              typography: 'h1',
              display: 'block',
            },
            [theme.breakpoints.up('md')]: { typography: 'h1', mb: 16 },
          }}>
          {caption}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('md')]: { flexDirection: 'row' },
          }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
