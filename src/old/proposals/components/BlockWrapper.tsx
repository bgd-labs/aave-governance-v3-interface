import { Box, SxProps, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { BoxWith3D } from '../../ui';

interface BlockWrapperProps {
  children: ReactNode;
  contentColor?: string;
  leftBorderColor?: string;
  bottomBorderColor?: string;
  css?: SxProps;
  toBottom?: boolean;
}

export function BlockWrapper({
  children,
  contentColor,
  leftBorderColor,
  bottomBorderColor,
  css,
  toBottom,
}: BlockWrapperProps) {
  const theme = useTheme();

  return (
    <BoxWith3D
      className="ProposalLoading__SSR"
      alwaysWithBorders
      wrapperCss={{
        mt: toBottom ? 0 : 18,
        mb: toBottom ? 18 : 0,
        [theme.breakpoints.up('lg')]: {
          mt: toBottom ? 0 : 24,
          mb: toBottom ? 24 : 0,
        },
      }}
      borderSize={10}
      contentColor={contentColor}
      leftBorderColor={leftBorderColor}
      bottomBorderColor={bottomBorderColor}
      css={css}>
      <Box
        sx={{
          p: 18,
          width: '100%',
          [theme.breakpoints.up('lg')]: { p: '24px 30px' },
        }}>
        {children}
      </Box>
    </BoxWith3D>
  );
}
