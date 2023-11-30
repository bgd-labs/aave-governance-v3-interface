import { useTheme } from '@mui/system';
import { ReactNode } from 'react';

import { BoxWith3D } from '../../../ui';

interface RightPanelWrapperProps {
  children: ReactNode;
}

export function RightPanelWrapper({ children }: RightPanelWrapperProps) {
  const theme = useTheme();

  return (
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
  );
}
