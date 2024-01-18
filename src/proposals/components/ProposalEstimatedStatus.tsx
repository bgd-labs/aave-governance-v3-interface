import { ProposalEstimatedState } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, SxProps } from '@mui/system';

import { useStore } from '../../store';
import { Timer } from '../../ui';

interface ProposalEstimatedStatusProps {
  proposalId: number;
  estimatedStatus: ProposalEstimatedState;
  timestamp: number;
  isSecondary?: boolean;
  css?: SxProps;
  isForModal?: boolean;
  isForHelpModal?: boolean;
}

export function ProposalEstimatedStatus({
  proposalId,
  estimatedStatus,
  timestamp,
  isSecondary,
  css,
  isForModal,
  isForHelpModal,
}: ProposalEstimatedStatusProps) {
  const { getDetailedProposalsData } = useStore();

  const statusTextStringArray = estimatedStatus.split(' ');
  statusTextStringArray.splice(
    estimatedStatus === ProposalEstimatedState.Active ? -3 : -1,
  );
  const statusText = statusTextStringArray.join(' ');
  const statusStringArray = estimatedStatus.split(' ');
  const status =
    estimatedStatus === ProposalEstimatedState.Active
      ? statusStringArray.splice(1).join(' ')
      : statusStringArray[statusStringArray.length - 1];

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
              ? isForModal
                ? '$mainAgainst'
                : '$text'
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
        {isForModal ? status : status === 'fail' ? 'end' : status}
      </Box>

      <Box component="p" sx={{ typography: 'body', color: '$textSecondary' }}>
        in{' '}
        <Timer
          timestamp={timestamp}
          callbackFuncWhenTimerFinished={() =>
            !isForHelpModal &&
            getDetailedProposalsData({ ids: [proposalId], fullData: true })
          }
        />
      </Box>
    </Box>
  );
}
