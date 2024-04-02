import { Asset } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import { Address } from 'viem';

import { useRootStore } from '../../store/storeProvider';
import { Divider } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { FormattedNumber } from '../../ui/components/FormattedNumber';
import { TokenIcon } from '../../ui/components/TokenIcon';
import { DelegateData } from '../types';
import { getFormDelegateData } from '../utils/getFormDelegateData';
import { DelegateTableItemAddress } from './DelegateTableItemAddress';

export interface TableItemProps {
  underlyingAsset?: Address;
  symbol?: Asset;
  amount?: number;
  votingToAddress?: Address | string;
  propositionToAddress?: Address | string;
  loading?: boolean;
  isEdit?: boolean;
  isViewChanges?: boolean;
  formDelegateData?: DelegateData[];
  inputName?: string;
  forHelp?: boolean;
}

export function TableItem({
  underlyingAsset,
  symbol,
  amount,
  votingToAddress,
  propositionToAddress,
  loading,
  isEdit,
  isViewChanges,
  formDelegateData,
  inputName,
  forHelp,
}: TableItemProps) {
  const theme = useTheme();
  const delegateDataLoading = useRootStore(
    (store) => store.delegateDataLoading,
  );

  const { formVotingToAddress, formPropositionToAddress } = getFormDelegateData(
    {
      underlyingAsset,
      votingToAddress,
      propositionToAddress,
      formDelegateData,
    },
  );

  const dataLoading = forHelp ? false : delegateDataLoading;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          [theme.breakpoints.up('sm')]: {
            height: 84,
          },
          [theme.breakpoints.up('md')]: {
            height: forHelp ? 85 : 108,
          },
          [theme.breakpoints.up('lg')]: {
            height: forHelp ? 90 : 116,
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
            maxWidth: 200,
          }}>
          {!symbol ? (
            <Box sx={{ mr: 16 }}>
              <CustomSkeleton circle width={35} height={35} />
            </Box>
          ) : (
            <TokenIcon
              symbol={symbol}
              css={{ mr: 16, width: 35, height: 35 }}
            />
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {!symbol ? (
              <Box sx={{ mb: 4 }}>
                <CustomSkeleton width={30} height={20} />
              </Box>
            ) : (
              <Box component="h2" sx={{ typography: 'h2', mb: 4 }}>
                {symbol}
              </Box>
            )}
            {(!amount && amount !== 0) || dataLoading ? (
              <Box
                sx={{
                  '*': { lineHeight: 1 },
                  '.TableItem__value--loading': {
                    height: 17,
                    [theme.breakpoints.up('lg')]: {
                      height: 19,
                    },
                  },
                }}>
                <CustomSkeleton
                  className="TableItem__value--loading"
                  width={30}
                />
              </Box>
            ) : (
              <FormattedNumber
                value={amount}
                variant="h3"
                visibleDecimals={2}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flex: 2, justifyContent: 'center', pr: 7 }}>
          {loading || dataLoading ? (
            <CustomSkeleton width={150} height={20} />
          ) : (
            <DelegateTableItemAddress
              isEdit={!!isEdit}
              isViewChanges={!!isViewChanges}
              inputName={`${inputName}.votingToAddress`}
              address={votingToAddress}
              addressTo={formVotingToAddress}
              forHelp={forHelp}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flex: 2, justifyContent: 'center', pl: 7 }}>
          {loading || dataLoading ? (
            <CustomSkeleton width={150} height={20} />
          ) : (
            <DelegateTableItemAddress
              isEdit={!!isEdit}
              isViewChanges={!!isViewChanges}
              inputName={`${inputName}.propositionToAddress`}
              address={propositionToAddress}
              addressTo={formPropositionToAddress}
              forHelp={forHelp}
            />
          )}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
}
