import { Box } from '@mui/system';
import React, { ReactNode } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import {
  TableContainer,
  TableContainerChildren,
} from '../../ui/components/TableContainer';
import {
  AppClientsStorage,
  RpcSwitcherFormData,
} from '../store/rpcSwitcherSlice';
import { RpcSwitcherTable } from './RpcSwitcherTable';

interface RpcSwitcherTableWrapperProps {
  loading: boolean;
  rpcSwitcherData: Record<number, AppClientsStorage>;
  isEdit: boolean;
  isViewChanges: boolean;
  fields?: any;
  formData?: RpcSwitcherFormData;
  children: ReactNode;
  handleFormSubmit?: (data: any) => void;
}

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
  return (
    <TableContainer>
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
          <TableContainerChildren>{children}</TableContainerChildren>
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
          <TableContainerChildren>{children}</TableContainerChildren>
        </>
      )}
    </TableContainer>
  );
}
