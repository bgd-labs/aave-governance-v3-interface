import { Asset } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';

import { Divider } from '../../ui';
import { TableHeaderTitle } from '../../ui/components/TableHeaderTitle';
import { texts } from '../../ui/utils/texts';
import { DelegateData, DelegateItem } from '../types';
import { MobileCard } from './MobileCard';
import { TableItem } from './TableItem';

interface DelegateTableProps {
  loading: boolean;
  delegateData: DelegateItem[];
  isEdit: boolean;
  isViewChanges: boolean;
  fields?: any;
  formDelegateData?: DelegateData[];
  forHelp?: boolean;
}

export function DelegateTable({
  loading,
  delegateData,
  isEdit,
  isViewChanges,
  fields,
  formDelegateData,
  forHelp,
}: DelegateTableProps) {
  const theme = useTheme();

  const dataForInputs: { symbol: Asset; amount: number; inputName: string }[] =
    !!fields
      ? fields.map((name: string, index: number) => {
          return {
            symbol: delegateData[index].symbol,
            amount: delegateData[index].amount,
            inputName: name,
          };
        })
      : [];

  return (
    <>
      <Box
        sx={{
          display: 'none',
          [theme.breakpoints.up('md')]: {
            display: 'block',
          },
        }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TableHeaderTitle
              title="Asset"
              css={{
                maxWidth: 200,
              }}
            />
            <TableHeaderTitle
              css={{ pr: 7 }}
              title={texts.delegatePage.tableHeaderVoting}
              center
            />
            <TableHeaderTitle
              css={{ pl: 7 }}
              title={texts.delegatePage.tableHeaderProposition}
              center
            />
          </Box>
          <Divider />
        </Box>
        {isEdit ? (
          dataForInputs.map((item) => {
            return (
              <TableItem
                key={item.inputName}
                isEdit={isEdit}
                isViewChanges={isViewChanges}
                loading={loading}
                amount={item.amount}
                symbol={item.symbol}
                inputName={item.inputName}
                forHelp={forHelp}
              />
            );
          })
        ) : (
          <>
            {loading ? (
              <TableItem loading={loading} />
            ) : (
              delegateData.map((item) => (
                <TableItem
                  key={item.underlyingAsset}
                  isEdit={isEdit}
                  isViewChanges={isViewChanges}
                  formDelegateData={formDelegateData}
                  loading={loading}
                  forHelp={forHelp}
                  {...item}
                />
              ))
            )}
          </>
        )}
      </Box>

      <Box
        sx={{
          display: 'block',
          [theme.breakpoints.up('md')]: { display: 'none' },
        }}>
        {isEdit ? (
          dataForInputs.map((item) => {
            return (
              <MobileCard
                key={item.inputName}
                isEdit={isEdit}
                isViewChanges={isViewChanges}
                loading={loading}
                amount={item.amount}
                symbol={item.symbol}
                inputName={item.inputName}
                forHelp={forHelp}
              />
            );
          })
        ) : (
          <>
            {loading ? (
              <MobileCard loading={loading} />
            ) : (
              delegateData.map((item) => (
                <MobileCard
                  key={item.underlyingAsset}
                  isEdit={isEdit}
                  isViewChanges={isViewChanges}
                  formDelegateData={formDelegateData}
                  loading={loading}
                  forHelp={forHelp}
                  {...item}
                />
              ))
            )}
          </>
        )}
      </Box>
    </>
  );
}
