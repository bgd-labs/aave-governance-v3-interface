import { selectLastTxByTypeAndPayload } from '@bgd-labs/frontend-web3-utils/src';
import { Box } from '@mui/system';
import React from 'react';

import { checkIsVotingAvailable } from '../../../representations/store/representationsSelectors';
import { useStore } from '../../../store';
import { TransactionUnion } from '../../../transactions/store/transactionsSlice';
import { SmallButton } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { NetworkIcon } from '../../../ui/components/NetworkIcon';
import { texts } from '../../../ui/utils/texts';

interface VoteButtonProps {
  balanceLoading: boolean;
  votingPower: number;
  proposalId: number;
  votingChainId: number;
  onClick: (proposalId: number) => void;
  isForHelpModal?: boolean;
}

export function VoteButton({
  balanceLoading,
  votingPower,
  proposalId,
  votingChainId,
  onClick,
  isForHelpModal,
}: VoteButtonProps) {
  const store = useStore();
  const { representative, getActiveAddress, supportObject } = store;

  const activeAddress = getActiveAddress();

  const tx = useStore((state) =>
    selectLastTxByTypeAndPayload<TransactionUnion>(
      state,
      activeAddress || '',
      'vote',
      {
        proposalId,
        support: !supportObject[proposalId],
        voter: representative.address || activeAddress,
      },
    ),
  );

  const buttonLoading =
    tx &&
    tx.type === 'vote' &&
    tx.payload.proposalId === proposalId &&
    tx.payload.voter === (representative.address || activeAddress) &&
    tx.chainId === votingChainId &&
    (tx.pending || tx.status === 1);

  const disabled = !checkIsVotingAvailable(store, votingChainId);

  return (
    <>
      {balanceLoading ? (
        <CustomSkeleton width={102} height={22} />
      ) : (
        <>
          {votingPower > 0 ? (
            <>
              {disabled && !isForHelpModal ? (
                <Box
                  sx={(theme) => ({
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${theme.palette.$textDisabled}`,
                    minWidth: 95,
                    height: 20,
                    position: 'relative',
                    p: 4,
                    backgroundColor: '$mainLight',
                    [theme.breakpoints.up('lg')]: {
                      minWidth: 102,
                      height: 22,
                    },
                  })}>
                  <Box
                    sx={{
                      typography: 'descriptor',
                      color: '$textDisabled',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}>
                    <NetworkIcon
                      chainId={votingChainId}
                      size={10}
                      css={{ mr: 4 }}
                    />
                    {texts.other.notAvailable}
                  </Box>
                </Box>
              ) : (
                <SmallButton
                  loading={buttonLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onClick(proposalId);
                  }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}>
                    <NetworkIcon
                      chainId={votingChainId}
                      size={10}
                      css={{ mr: 4 }}
                    />
                    {texts.proposals.vote}
                  </Box>
                </SmallButton>
              )}
            </>
          ) : (
            <Box
              component="p"
              sx={{ typography: 'body', color: '$textSecondary' }}>
              <Box
                component="span"
                sx={{ typography: 'headline', color: '$text' }}>
                {texts.proposals.notEnough}
              </Box>{' '}
              {texts.proposals.toVote}
            </Box>
          )}
        </>
      )}
    </>
  );
}
