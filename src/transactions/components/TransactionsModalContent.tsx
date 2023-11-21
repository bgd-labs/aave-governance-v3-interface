import { Box } from '@mui/system';
import React from 'react';

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
          height: isRepresentedAvailable ? 364 : 324,
          pr: 20,
          [theme.breakpoints.up('lg')]: {
            height: isRepresentedAvailable ? 368 : 324,
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
