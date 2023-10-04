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
  forHelp?: boolean;
}

const ChildrenWrapper = ({
  children,
  forTest,
}: {
  children: ReactNode;
  forTest?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: forTest ? 20 : 40,
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
  forHelp,
}: RepresentationsTableWrapperProps) {
  const theme = useTheme();
  return (
    <BoxWith3D
      borderSize={10}
      contentColor="$mainLight"
      css={{
        pb: forHelp ? 20 : 40,
        [theme.breakpoints.up('sm')]: { pb: forHelp ? 20 : 34 },
      }}>
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
          <ChildrenWrapper forTest={forHelp}>{children}</ChildrenWrapper>
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
          <ChildrenWrapper forTest={forHelp}>{children}</ChildrenWrapper>
        </>
      )}
    </BoxWith3D>
  );
}
