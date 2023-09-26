import { Box, useTheme } from '@mui/system';
import React, { ReactNode } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import { BoxWith3D } from '../../ui';
import {
  RepresentationDataItem,
  RepresentationFormData,
} from '../store/representationsSlice';
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

export function RepresentationsTableWrapper({
  representationData,
  loading,
  isEdit,
  isViewChanges,
  fields,
  children,
  formData,
  handleFormSubmit,
}: RepresentationsTableWrapperProps) {
  const theme = useTheme();
  return (
    <BoxWith3D
      borderSize={10}
      contentColor="$mainLight"
      css={{
        p: '12px 10px 25px',
        [theme.breakpoints.up('sm')]: { p: '30px 40px' },
        [theme.breakpoints.up('md')]: { p: 0, pb: 40 },
      }}>
      {typeof handleFormSubmit === 'function' ? (
        <Box component="form" onSubmit={handleFormSubmit}>
          <FieldArray name="formData">
            {({ fields }) => (
              <RepresentationsTable
                loading={loading}
                representationData={representationData}
                isEdit={isEdit}
                fields={fields}
                isViewChanges={isViewChanges}
              />
            )}
          </FieldArray>
          <ChildrenWrapper>{children}</ChildrenWrapper>
        </Box>
      ) : (
        <>
          <RepresentationsTable
            loading={loading}
            representationData={representationData}
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
