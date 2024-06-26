import { CachedProposalDataItemWithId } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { Link } from '../../../ui';
import { ROUTES } from '../../../ui/utils/routes';
import { ProposalListItemFinalStatus } from './ProposalListItemFinalStatus';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';

interface CachedProposalListItemProps {
  proposalData: CachedProposalDataItemWithId;
}

export function CachedProposalListItem({
  proposalData,
}: CachedProposalListItemProps) {
  const theme = useTheme();

  const isRendered = useStore((state) => state.isRendered);
  const proposal = proposalData.proposal;

  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="ProposalListItem">
      <Box
        component={Link}
        href={ROUTES.proposal(proposal.data.id, proposal.data.ipfsHash)}
        onClick={() => setIsClicked(true)}>
        <ProposalListItemWrapper
          isVotingActive={false}
          isFinished={true}
          disabled={isClicked}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              [theme.breakpoints.up('sm')]: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            }}>
            <Box
              sx={{
                width: '100%',
                mb: 16,
                [theme.breakpoints.up('sm')]: { width: 315, mb: 0 },
                [theme.breakpoints.up('lg')]: { width: 440 },
              }}>
              <Box
                className="ProposalListItem__title"
                component="h2"
                sx={{
                  color: isRendered
                    ? `${theme.palette.$text} !important`
                    : theme.palette.$text,
                  typography: 'h2',
                }}>
                {proposal.data.title}
              </Box>
            </Box>

            <ProposalListItemFinalStatus
              timestamp={proposal.data.finishedTimestamp}
              status={proposal.combineState}
            />
          </Box>
        </ProposalListItemWrapper>
      </Box>
    </div>
  );
}
