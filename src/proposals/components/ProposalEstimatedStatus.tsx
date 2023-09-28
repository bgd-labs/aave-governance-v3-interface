import { Box, SxProps } from '@mui/system';
import { ProposalEstimatedState } from 'aave-governance-ui-helpers';
import { useEffect } from 'react';

import { useStore } from '../../store';
import { Timer } from '../../ui';

interface ProposalEstimatedStatusProps {
  proposalId: number;
  estimatedStatus: ProposalEstimatedState;
  timestamp: number;
  isSecondary?: boolean;
  css?: SxProps;

  isForHelpModal?: boolean;
}

export function ProposalEstimatedStatus({
  proposalId,
  estimatedStatus,
  timestamp,
  isSecondary,
  css,
  isForHelpModal,
}: ProposalEstimatedStatusProps) {
  const { activeWallet, getDetailedProposalsData, getL1Balances } = useStore();

  useEffect(() => {
    if (
      activeWallet?.isActive &&
      estimatedStatus &&
      estimatedStatus < ProposalEstimatedState.ProposalExecuted &&
      !isForHelpModal
    ) {
      getL1Balances([proposalId]);
    }
  }, [estimatedStatus]);

  const statusTextStringArray = estimatedStatus.split(' ');
  statusTextStringArray.splice(-1);
  const statusText = statusTextStringArray.join(' ');
  const statusStringArray = estimatedStatus.split(' ');
  const status = statusStringArray[statusStringArray.length - 1];

  return (
    <Box
      className="ProposalEstimatedStatus"
      sx={{ display: 'flex', whiteSpace: 'nowrap', ...css }}>
      <Box
        className="ProposalStatus"
        component="p"
        sx={{
          typography: 'headline',
          mr: 4,
          color:
            estimatedStatus === ProposalEstimatedState.Defeated
              ? '$mainAgainst'
              : estimatedStatus === ProposalEstimatedState.Succeed
              ? '$mainFor'
              : estimatedStatus === ProposalEstimatedState.Expired
              ? '$textDisabled'
              : isSecondary
              ? '$textSecondary'
              : '$text',
        }}>
        <Box component="span" sx={{ typography: 'body', color: '$text' }}>
          {statusText}
        </Box>{' '}
        {status}
      </Box>

      <Box component="p" sx={{ typography: 'body', color: '$textSecondary' }}>
        in{' '}
        <Timer
          timestamp={timestamp}
          callbackFuncWhenTimerFinished={() =>
            !isForHelpModal && getDetailedProposalsData([proposalId])
          }
        />
      </Box>
    </Box>
  );
}
