import { Box, useTheme } from '@mui/system';

import { Divider } from '../../ui';
import { TableHeaderTitle } from '../../ui/components/TableHeaderTitle';
import { texts } from '../../ui/utils/texts';
import {
  AppProviderStorage,
  RpcSwitcherFormData,
} from '../store/providerSlice';
import { TableItem } from './TableItem';

interface RepresentationsTableProps {
  loading: boolean;
  rpcSwitcherData: Record<number, AppProviderStorage>;
  fields?: any;
  formData?: RpcSwitcherFormData;
}

export function RpcSwitcherTable({
  loading,
  rpcSwitcherData,
  fields,
}: RepresentationsTableProps) {
  const theme = useTheme();

  const dataForInputs: {
    chainId: number;
    rpcUrl: string;
    inputName: string;
  }[] = !!fields
    ? fields.map((name: string, index: number) => {
        return {
          chainId: +Object.entries(rpcSwitcherData)[index][0],
          rpcUrl: Object.entries(rpcSwitcherData)[index][1].rpcUrl,
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
                display: 'block',
                [theme.breakpoints.up('sm')]: {
                  display: 'block',
                  minWidth: 250,
                },
                [theme.breakpoints.up('md')]: {
                  maxWidth: 300,
                  minWidth: 300,
                },
              }}
            />
            <TableHeaderTitle
              css={{
                display: 'block',
                [theme.breakpoints.up('sm')]: { display: 'none' },
              }}
              title={texts.other.edit}
              center
            />
            <TableHeaderTitle
              css={{
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                  display: 'block',
                },
              }}
              title={texts.representationsPage.tableHeaderRepresented}
              right
            />
          </Box>
          <Divider sx={{ mt: 20, [theme.breakpoints.up('sm')]: { mt: 0 } }} />
        </Box>

        {dataForInputs.length &&
          dataForInputs.map((item) => {
            return (
              <TableItem
                key={item.inputName}
                loading={loading}
                chainId={item.chainId}
                inputName={item.inputName}
              />
            );
          })}
      </Box>
    </>
  );
}
