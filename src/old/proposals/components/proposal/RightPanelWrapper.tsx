import { Box, useTheme } from '@mui/system';
import { ReactNode } from 'react';

import { BoxWith3D } from '../../../ui';

interface RightPanelWrapperProps {
  children: ReactNode;
  onlyChildren?: boolean;
}

export function RightPanelWrapper({
  children,
  onlyChildren,
}: RightPanelWrapperProps) {
  const theme = useTheme();

  return (
    <>
      {onlyChildren ? (
        <Box
          sx={{
            flex: 1,
            maxWidth: '100%',
            [theme.breakpoints.up('sm')]: {
              maxWidth: 'calc(100% - 305px)',
            },
            [theme.breakpoints.up('lg')]: {
              maxWidth: 'calc(100% - 365px)',
            },
            '.ProposalDetails__error': {
              m: 0,
            },
          }}>
          {children}
        </Box>
      ) : (
        <BoxWith3D
          className="ProposalLoading__SSR"
          borderSize={10}
          contentColor="$mainLight"
          wrapperCss={{
            flex: 1,
            maxWidth: '100%',
            [theme.breakpoints.up('sm')]: {
              maxWidth: 'calc(100% - 305px)',
            },
            [theme.breakpoints.up('lg')]: {
              maxWidth: 'calc(100% - 365px)',
            },
          }}
          css={{
            p: 18,
            [theme.breakpoints.up('lg')]: { p: '24px 30px' },
          }}>
          {children}
        </BoxWith3D>
      )}
    </>
  );
}
