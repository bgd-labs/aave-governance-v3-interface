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
          overflowY: 'scroll',
          height: forTest ? 191 : 440,
          pr: 20,
          [theme.breakpoints.up('sm')]: {
            height: forTest ? 128 : 440,
          },
          [theme.breakpoints.up('lg')]: {
            height: forTest ? 139 : 440,
          },
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
