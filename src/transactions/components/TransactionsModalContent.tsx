import { Box } from '@mui/system';

import { RepresentedAddress } from '../../representations/store/representationsSlice';
import { BackButton3D, Divider } from '../../ui';
import { texts } from '../../ui/utils/texts';
import { AllTransactions } from '../store/transactionsSlice';
import { TransactionInfoItem } from './TransactionInfoItem';

interface TransactionsModalContentProps {
  allTransactions: AllTransactions;
  onBackButtonClick: () => void;
  representedAddresses?: RepresentedAddress[];
}

export function TransactionsModalContent({
  allTransactions,
  onBackButtonClick,
  representedAddresses,
}: TransactionsModalContentProps) {
  const isRepresentedAvailable =
    typeof representedAddresses !== 'undefined' &&
    !!representedAddresses.length;

  return (
    <Box>
      <Box
        component="h3"
        sx={{ typography: 'h3', textAlign: 'center', fontWeight: '600' }}>
        {texts.transactions.allTransactions}
      </Box>

      <Divider sx={{ mt: 13, mb: 26 }} />

      <Box
        sx={{
          overflowY: 'scroll',
          height: isRepresentedAvailable ? 351 : 316,
          pr: 20,
        }}>
        {allTransactions.map((tx, index) => (
          <TransactionInfoItem key={index} tx={tx} />
        ))}
      </Box>

      <BackButton3D
        isSmall
        alwaysWithBorders
        isVisibleOnMobile
        alwaysVisible
        onClick={onBackButtonClick}
        wrapperCss={{ mt: 40 }}
      />
    </Box>
  );
}
