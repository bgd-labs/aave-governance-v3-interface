import { Box } from '@mui/system';
import React, { ReactNode } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { DelegateData, DelegateItem } from '../../types';
import {
  TableContainer,
  TableContainerChildren,
} from '../Table/TableContainer';
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
  return (
    <TableContainer forHelp={forHelp}>
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
          <TableContainerChildren forHelp={forHelp}>
            {children}
          </TableContainerChildren>
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
          <TableContainerChildren forHelp={forHelp}>
            {children}
          </TableContainerChildren>
        </>
      )}
    </TableContainer>
  );
}
