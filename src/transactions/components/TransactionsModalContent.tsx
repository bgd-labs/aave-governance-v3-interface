import { Box } from '@mui/system';
import React from 'react';

import { BackButton3D, Divider } from '../../ui';
import { texts } from '../../ui/utils/texts';
import { AllTransactions } from '../store/transactionsSlice';
import { TransactionInfoItem } from './TransactionInfoItem';

interface TransactionsModalContentProps {
  allTransactions: AllTransactions;
  onBackButtonClick: () => void;
}

export function TransactionsModalContent({
  allTransactions,
  onBackButtonClick,
}: TransactionsModalContentProps) {
  return (
    <Box>
      <Box
        component="h3"
        sx={{ typography: 'h3', textAlign: 'left', fontWeight: '600' }}>
        {texts.transactions.allTransactions}
      </Box>

      <Divider
        sx={(theme) => ({
          my: 14,
          borderBottomColor: theme.palette.$secondaryBorder,
          width: '100%',
        })}
      />

      <Box
        sx={(theme) => ({
          overflowY: 'scroll',
          height: 420,
          pr: 20,
        })}>
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
