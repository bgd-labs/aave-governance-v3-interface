import { Box, useTheme } from '@mui/system';

import { useRootStore } from '../../store/storeProvider';
import { BoxWith3D } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { FormattedNumber } from '../../ui/components/FormattedNumber';
import { TokenIcon } from '../../ui/components/TokenIcon';
import { texts } from '../../ui/utils/texts';
import { getFormDelegateData } from '../utils/getFormDelegateData';
import { DelegateTableItemAddress } from './DelegateTableItemAddress';
import { TableItemProps } from './TableItem';

export function MobileCard({
  symbol,
  amount,
  votingToAddress,
  propositionToAddress,
  isEdit,
  isViewChanges,
  inputName,
  underlyingAsset,
  formDelegateData,
  loading,
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
    <Box sx={{ mb: 30 }}>
      <BoxWith3D
        contentColor="$mainLight"
        borderSize={4}
        wrapperCss={{
          mb: 24,
        }}
        css={{
          p: '7px 12px',
        }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!symbol ? (
              <Box sx={{ mr: 4 }}>
                <CustomSkeleton circle width={30} height={30} />
              </Box>
            ) : (
              <TokenIcon
                symbol={symbol}
                css={{ mr: 4, width: 30, height: 30 }}
              />
            )}
            {!symbol ? (
              <CustomSkeleton width={30} height={19} />
            ) : (
              <Box component="h2" sx={{ typography: 'h1', fontWeight: '600' }}>
                {symbol}
              </Box>
            )}
          </Box>
          {(!amount && amount !== 0) || dataLoading ? (
            <CustomSkeleton width={30} height={17} />
          ) : (
            <FormattedNumber value={amount} variant="h3" visibleDecimals={2} />
          )}
        </Box>
      </BoxWith3D>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <Box
          component="h3"
          sx={{
            typography: 'h2',
            [theme.breakpoints.up('sm')]: { flex: 1 },
            [theme.breakpoints.up('md')]: { flex: 'auto' },
          }}>
          {texts.delegatePage.tableHeaderVoting}
        </Box>
        <Box
          sx={{
            display: 'flex',
            minWidth: isEdit ? '100%' : 'unset',
            mt: isEdit ? 8 : 0,
            justifyContent: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              minWidth: 350,
              mt: 0,
              flex: 2,
              justifyContent: 'flex-end',
            },
            [theme.breakpoints.up('md')]: { flex: 'auto' },
          }}>
          {loading || dataLoading ? (
            <Box sx={{ '*': { lineHeight: 1 } }}>
              <CustomSkeleton width={150} height={17} />
            </Box>
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
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <Box
          component="h3"
          sx={{
            typography: 'h2',
            [theme.breakpoints.up('sm')]: { flex: 1 },
            [theme.breakpoints.up('md')]: { flex: 'auto' },
          }}>
          {texts.delegatePage.tableHeaderProposition}
        </Box>
        <Box
          sx={{
            display: 'flex',
            minWidth: isEdit ? '100%' : 'unset',
            mt: isEdit ? 8 : 0,
            justifyContent: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              minWidth: 350,
              mt: 0,
              flex: 2,
              justifyContent: 'flex-end',
            },
            [theme.breakpoints.up('md')]: { flex: 'auto' },
          }}>
          {loading || dataLoading ? (
            <Box sx={{ '*': { lineHeight: 1 } }}>
              <CustomSkeleton width={150} height={17} />
            </Box>
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
    </Box>
  );
}
