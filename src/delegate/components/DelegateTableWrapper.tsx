import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { BoxWith3D } from '../../ui';
import { DelegateData, DelegateItem } from '../types';
import { DelegateTable } from './DelegateTable';

interface DelegateTableWrapperProps {
  loading: boolean;
  delegateData: DelegateItem[];
  isEdit: boolean;
  isViewChanges: boolean;
  fields?: any;
  formDelegateData?: DelegateData[];
  children: ReactNode;
  handleFormSubmit?: (formDelegateData: any) => void;
  forHelp?: boolean;
}

const ChildrenWrapper = ({
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
        mt: forHelp ? 20 : 40,
      }}>
      {children}
    </Box>
  );
};

export function DelegateTableWrapper({
  loading,
  delegateData,
  isEdit,
  isViewChanges,
  fields,
  formDelegateData,
  children,
  handleFormSubmit,
  forHelp,
}: DelegateTableWrapperProps) {
  const theme = useTheme();
  return (
    <BoxWith3D
      alwaysWithBorders={forHelp}
      borderSize={10}
      contentColor="$mainLight"
      css={{
        p: '12px 10px 25px',
        [theme.breakpoints.up('sm')]: { p: '30px 40px' },
        [theme.breakpoints.up('md')]: { p: 0, pb: forHelp ? 20 : 40 },
      }}>
      {typeof handleFormSubmit === 'function' ? (
        <Box component="form" onSubmit={handleFormSubmit}>
          <FieldArray name="formDelegateData">
            {({ fields }) => (
              <DelegateTable
                loading={loading}
                delegateData={delegateData}
                isEdit={isEdit}
                fields={fields}
                isViewChanges={isViewChanges}
                forHelp={forHelp}
              />
            )}
          </FieldArray>
          <ChildrenWrapper forHelp={forHelp}>{children}</ChildrenWrapper>
        </Box>
      ) : (
        <>
          <DelegateTable
            loading={loading}
            delegateData={delegateData}
            isEdit={isEdit}
            isViewChanges={isViewChanges}
            fields={fields}
            formDelegateData={formDelegateData}
            forHelp={forHelp}
          />
          <ChildrenWrapper forHelp={forHelp}>{children}</ChildrenWrapper>
        </>
      )}
    </BoxWith3D>
  );
}
