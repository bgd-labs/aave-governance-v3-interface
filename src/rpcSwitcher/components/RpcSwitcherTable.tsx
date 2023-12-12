import { Box, useTheme } from '@mui/system';

import { Divider } from '../../ui';
import { TableHeaderTitle } from '../../ui/components/TableHeaderTitle';
import { texts } from '../../ui/utils/texts';
import {
  AppClientsStorage,
  RpcSwitcherFormData,
} from '../store/rpcSwitcherSlice';
import { TableItem } from './TableItem';

interface RpcSwitcherTableProps {
  loading: boolean;
  rpcSwitcherData: Record<number, AppClientsStorage>;
  isEdit: boolean;
  isViewChanges: boolean;
  fields?: any;
  formData?: RpcSwitcherFormData;
}

export function RpcSwitcherTable({
  loading,
  rpcSwitcherData,
  isEdit,
  isViewChanges,
  fields,
  formData,
}: RpcSwitcherTableProps) {
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
    <Box>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TableHeaderTitle
            title={texts.rpcSwitcherPage.tableHeaderNetwork}
            css={{
              maxWidth: 250,
              display: !isEdit ? 'block' : 'none',
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
              display: isEdit ? 'block' : 'none',
              [theme.breakpoints.up('sm')]: { display: 'none' },
            }}
            title={texts.other.edit}
            center
          />
          <TableHeaderTitle
            css={{
              display: !isEdit ? 'block' : 'none',
              [theme.breakpoints.up('sm')]: {
                display: 'block',
              },
            }}
            title={texts.rpcSwitcherPage.tableHeaderSwitcher}
            right
          />
        </Box>
        <Divider
          className="Divider"
          sx={{ mt: 20, [theme.breakpoints.up('sm')]: { mt: 0 } }}
        />
      </Box>

      {isEdit ? (
        dataForInputs.length &&
        dataForInputs.map((item) => {
          return (
            <TableItem
              key={item.inputName}
              loading={loading}
              chainId={item.chainId}
              inputName={item.inputName}
              isEdit={isEdit}
              isViewChanges={isViewChanges}
              rpcUrl={item.rpcUrl}
            />
          );
        })
      ) : (
        <>
          {loading ? (
            <TableItem loading={loading} />
          ) : (
            Object.entries(rpcSwitcherData).map((data) => (
              <TableItem
                key={data[0]}
                isEdit={isEdit}
                isViewChanges={isViewChanges}
                loading={loading}
                chainId={+data[0]}
                rpcUrl={data[1].rpcUrl}
                formData={formData}
              />
            ))
          )}
        </>
      )}
    </Box>
  );
}
