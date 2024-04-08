import {
  CreationFee,
  CreationFeeState,
} from '@bgd-labs/aave-governance-ui-helpers';
import { selectLastTxByTypeAndPayload } from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import React from 'react';

import { ProposalStatus } from '../../../proposals/components/ProposalStatus';
import { useStore } from '../../../store/ZustandStoreProvider';
import {
  TransactionUnion,
  TxType,
} from '../../../transactions/store/transactionsSlice';
import { BoxWith3D, Link, SmallButton } from '../../../ui';
import { ROUTES } from '../../../ui/utils/routes';
import { texts } from '../../../ui/utils/texts';

interface CreationFeesModalItemProps {
  data: CreationFee;
  setIsOpen: (value: boolean) => void;
  selectedProposalIds: number[];
  setSelectedProposalIds: (value: number[]) => void;
  txLoading: boolean;
}

export function CreationFeesModalItem({
  data,
  setIsOpen,
  selectedProposalIds,
  setSelectedProposalIds,
  txLoading,
}: CreationFeesModalItemProps) {
  const theme = useTheme();

  const { title, ipfsHash, status, proposalId, proposalStatus } = data;

  const txFromPool = useStore(
    (store) =>
      store.activeWallet &&
      selectLastTxByTypeAndPayload<TransactionUnion>(
        store.transactionsPool,
        store.activeWallet.address,
        TxType.claimFees,
        {
          creator: store.activeWallet?.address,
          proposalIds: [proposalId],
        },
      ),
  );

  return (
    <BoxWith3D
      alwaysWithBorders
      anySize
      borderSize={3}
      contentColor="$mainLight"
      bottomBorderColor="$light"
      wrapperCss={{
        mb: 12,
        position: 'relative',
      }}
      css={{
        display: 'flex',
        p: '4px 10px',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 75,
        },
      }}>
      <Box sx={{ display: 'flex', flex: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ typography: 'headline', mb: 2 }}>{title}</Box>
          <Box sx={{ display: 'inline-flex' }}>
            <Link
              css={{
                typography: 'descriptor',
                color: theme.palette.$textSecondary,
                transition: 'all 0.2s ease',
                hover: { opacity: 0.7 },
              }}
              onClick={() => setIsOpen(false)}
              href={ROUTES.proposal(proposalId, ipfsHash)}>
              {texts.other.details}
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            ml: 12,
            display: 'flex',
            justifyContent: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
            '.ProposalStatus': {
              mr: 0,
            },
          }}>
          <ProposalStatus status={proposalStatus} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          [theme.breakpoints.up('sm')]: {
            display: 'flex',
          },
          '.ProposalStatus': {
            mr: 0,
            typography: 'descriptorAccent',
          },
        }}>
        <ProposalStatus status={proposalStatus} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flex: 1,
        }}>
        {status === CreationFeeState.AVAILABLE ? (
          <SmallButton
            loading={
              txFromPool?.pending ||
              (txLoading && selectedProposalIds.includes(proposalId))
            }
            onClick={() => {
              setSelectedProposalIds([proposalId]);
            }}>
            {texts.creationFee.claim}
          </SmallButton>
        ) : (
          <Box
            sx={{
              color:
                status === CreationFeeState.LATER ? '$text' : '$textDisabled',
            }}>
            {status === CreationFeeState.NOT_AVAILABLE && 'Nothing to claim'}
            {status === CreationFeeState.LATER && 'In progress'}
            {status === CreationFeeState.RETURNED && 'Claimed'}
          </Box>
        )}
      </Box>
    </BoxWith3D>
  );
}
