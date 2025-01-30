import { Box } from '@mui/system';
import React, { ReactNode } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { RepresentationDataItem, RepresentationFormData } from '../../types';
import {
  TableContainer,
  TableContainerChildren,
} from '../Table/TableContainer';
import { RepresentationsTable } from './RepresentationsTable';

interface RepresentationsTableWrapperProps {
  loading: boolean;
  representationData: Record<number, RepresentationDataItem>;
  isEdit: boolean;
  isViewChanges: boolean;
  fields?: any;
  formData?: RepresentationFormData[];
  children: ReactNode;
  handleFormSubmit?: (data: any) => void;
  forHelp?: boolean;
}

export function RepresentationsTableWrapper({
  representationData,
  loading,
  isEdit,
  isViewChanges,
  fields,
  children,
  formData,
  handleFormSubmit,
  forHelp,
}: RepresentationsTableWrapperProps) {
  return (
    <TableContainer forHelp={forHelp}>
      {typeof handleFormSubmit === 'function' ? (
        <Box component="form" onSubmit={handleFormSubmit}>
          <FieldArray name="formData">
            {({ fields }) => (
              <RepresentationsTable
                forHelp={forHelp}
                loading={loading}
                representationData={representationData}
                isEdit={isEdit}
                fields={fields}
                isViewChanges={isViewChanges}
              />
            )}
          </FieldArray>
          <TableContainerChildren forHelp={forHelp}>
            {children}
          </TableContainerChildren>
        </Box>
      ) : (
        <>
          <RepresentationsTable
            forHelp={forHelp}
            loading={loading}
            representationData={representationData}
            isEdit={isEdit}
            isViewChanges={isViewChanges}
            fields={fields}
            formData={formData}
          />
          <TableContainerChildren forHelp={forHelp}>
            {children}
          </TableContainerChildren>
        </>
      )}
    </TableContainer>
  );
}
