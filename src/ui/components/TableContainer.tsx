import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { BoxWith3D } from './BoxWith3D';

export const TableContainerChildren = ({
  children,
  forHelp,
}: {
  children: ReactNode;
  forHelp?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: forHelp ? 18 : 36,
      }}>
      {children}
    </Box>
  );
};

interface TableContainerProps {
  forHelp?: boolean;
  children: ReactNode;
}

export function TableContainer({ forHelp, children }: TableContainerProps) {
  const theme = useTheme();

  return (
    <BoxWith3D
      className="NoDataWrapper"
      alwaysWithBorders={forHelp}
      borderSize={10}
      contentColor="$mainLight"
      css={{
        p: '24px 18px 36px',
        [theme.breakpoints.up('sm')]: {
          p: '24px 24px 36px',
        },
        [theme.breakpoints.up('md')]: {
          p: '24px 30px 36px',
          pb: forHelp ? 18 : 36,
        },
      }}>
      {children}
    </BoxWith3D>
  );
}
