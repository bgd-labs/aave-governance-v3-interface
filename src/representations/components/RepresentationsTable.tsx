import { Box, useTheme } from '@mui/system';

import { Divider } from '../../ui';
import { TableHeaderTitle } from '../../ui/components/TableHeaderTitle';
import { texts } from '../../ui/utils/texts';
import {
  RepresentationDataItem,
  RepresentationFormData,
} from '../store/representationsSlice';
import { TableItem } from './TableItem';

interface RepresentationsTableProps {
  loading: boolean;
  representationData: Record<number, RepresentationDataItem>;
  isEdit: boolean;
  isViewChanges: boolean;
  fields?: any;
  formData?: RepresentationFormData[];
}

export function RepresentationsTable({
  loading,
  representationData,
  isEdit,
  isViewChanges,
  fields,
  formData,
}: RepresentationsTableProps) {
  const theme = useTheme();

  const dataForInputs: {
    chainId: number;
    representative: string;
    inputName: string;
  }[] = !!fields
    ? fields.map((name: string, index: number) => {
        return {
          chainId: +Object.entries(representationData)[index][0],
          representative:
            Object.entries(representationData)[index][1].representative,
          inputName: name,
        };
      })
    : [];

  return (
    <>
      <Box
        sx={{
          px: 12,
          [theme.breakpoints.up('xsm')]: {
            px: 18,
          },
          [theme.breakpoints.up('md')]: {
            px: 30,
          },
        }}>
        <Box sx={{ pt: 15 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TableHeaderTitle
              title="Chain"
              css={{
                maxWidth: 250,
                [theme.breakpoints.up('sm')]: {
                  minWidth: 250,
                },
                [theme.breakpoints.up('md')]: {
                  maxWidth: 300,
                  minWidth: 300,
                },
              }}
            />
            <TableHeaderTitle
              title={texts.representationsPage.tableHeaderRepresented}
              right
            />
          </Box>
          <Divider sx={{ mt: 20, [theme.breakpoints.up('sm')]: { mt: 0 } }} />
        </Box>

        {isEdit ? (
          dataForInputs.length &&
          dataForInputs.map((item) => {
            return (
              <TableItem
                key={item.inputName}
                isEdit={isEdit}
                isViewChanges={isViewChanges}
                loading={loading}
                chainId={item.chainId}
                representativeAddress={item.representative}
                inputName={item.inputName}
              />
            );
          })
        ) : (
          <>
            {loading ? (
              <TableItem loading={loading} />
            ) : (
              Object.entries(representationData).map((data) => (
                <TableItem
                  key={data[0]}
                  isEdit={isEdit}
                  isViewChanges={isViewChanges}
                  loading={loading}
                  chainId={+data[0]}
                  representativeAddress={data[1].representative}
                  formData={formData}
                />
              ))
            )}
          </>
        )}
      </Box>
    </>
  );
}
