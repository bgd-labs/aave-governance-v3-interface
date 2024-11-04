import { Box } from '@mui/system';
import React from 'react';

import { BackButton3D, Divider } from '../../ui';
import { texts } from '../../ui/utils/texts';
import { AllTransactions } from '../store/transactionsSlice';
import { TransactionInfoItem } from './TransactionInfoItem';

interface TransactionsModalContentProps {
  allTransactions: AllTransactions;
  onBackButtonClick: () => void;
  forTest?: boolean;
}

export function TransactionsModalContent({
  allTransactions,
  onBackButtonClick,
  forTest,
}: TransactionsModalContentProps) {
  return (
    <Box>
      <Box component="h2" sx={{ typography: 'h2', textAlign: 'left' }}>
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
          overflowY: forTest ? 'scroll' : 'unset',
          pr: forTest ? 20 : 0,
          height: forTest ? 191 : '100%',
          [theme.breakpoints.up('sm')]: {
            overflowY: 'scroll',
            pr: 20,
            height: forTest ? 128 : 510,
          },
          [theme.breakpoints.up('lg')]: {
            height: forTest ? 139 : 580,
          },
        })}>
        {allTransactions.map((tx, index) => (
          <TransactionInfoItem key={index} tx={tx} />
        ))}
      </Box>

      <Box sx={{ mt: 40 }}>
        <BackButton3D
          isSmall
          alwaysWithBorders
          isVisibleOnMobile
          alwaysVisible
          onClick={onBackButtonClick}
        />
      </Box>
    </Box>
  );
}
