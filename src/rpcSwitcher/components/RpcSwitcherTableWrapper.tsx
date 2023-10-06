import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { BoxWith3D } from '../../ui';
import {
  AppProviderStorage,
  RpcSwitcherFormData,
} from '../store/providerSlice';
import { RpcSwitcherTable } from './RpcSwitcherTable';

interface RpcSwitcherTableWrapperProps {
  loading: boolean;
  rpcSwitcherData: Record<number, AppProviderStorage>;
  isEdit: boolean;
  isViewChanges: boolean;
  fields?: any;
  formData?: RpcSwitcherFormData;
  children: ReactNode;
  handleFormSubmit?: (data: any) => void;
}

const ChildrenWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 40,
      }}>
      {children}
    </Box>
  );
};

export function RpcSwitcherTableWrapper({
  rpcSwitcherData,
  loading,
  isEdit,
  isViewChanges,
  fields,
  children,
  formData,
  handleFormSubmit,
}: RpcSwitcherTableWrapperProps) {
  const theme = useTheme();
  return (
    <BoxWith3D
      borderSize={10}
      contentColor="$mainLight"
      css={{
        pb: 40,
        [theme.breakpoints.up('sm')]: { pb: 34 },
      }}>
      {typeof handleFormSubmit === 'function' ? (
        <Box component="form" onSubmit={handleFormSubmit}>
          <FieldArray name="formData">
            {({ fields }) => (
              <RpcSwitcherTable
                loading={loading}
                rpcSwitcherData={rpcSwitcherData}
                fields={fields}
                isEdit={isEdit}
                isViewChanges={isViewChanges}
              />
            )}
          </FieldArray>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Box>
      ) : (
        <>
          <RpcSwitcherTable
            loading={loading}
            rpcSwitcherData={rpcSwitcherData}
            isEdit={isEdit}
            isViewChanges={isViewChanges}
            fields={fields}
            formData={formData}
          />
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </>
      )}
    </BoxWith3D>
  );
}
