import { ReactNode } from 'react';

import { BoxWith3D } from './BoxWith3D';

interface NoDataWrapperProps {
  children: ReactNode;
}
export function NoDataWrapper({ children }: NoDataWrapperProps) {
  return (
    <BoxWith3D
      className="NoDataWrapper"
      borderSize={10}
      contentColor="$mainLight"
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 16,
        py: 40,
        minHeight: '40vh',
      }}>
      {children}
    </BoxWith3D>
  );
}
