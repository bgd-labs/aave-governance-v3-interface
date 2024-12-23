'use client';

import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react';

import { isForIPFS } from '../../configs/appConfig';
import { ROUTES } from '../../configs/routes';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ProposalOnTheList } from '../../types';
import { Link } from '../Link';
import { ProposalListItemFinalState } from './ProposalListItemFinalState';
import { ProposalListItemWrapper } from './ProposalListItemWrapper';

export function FinishedItem({ data }: { data: ProposalOnTheList }) {
  const theme = useTheme();
  const isRendered = useStore((store) => store.isRendered);
  const proposalDetails = useStore((store) => store.proposalDetails);
  const proposalsListData = useStore((store) => store.proposalsListData);
  const [isClicked, setIsClicked] = useState(false);

  let isHasActiveForIPFS = false;
  if (isForIPFS && proposalsListData.activeProposalsData[data.proposalId]) {
    isHasActiveForIPFS = true;
  }

  return (
    <div className="ProposalListItem">
      <Box
        component={Link}
        href={ROUTES.proposal(
          data.proposalId,
          data.ipfsHash,
          isHasActiveForIPFS,
        )}
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
                {data.title !== `Proposal ${data.proposalId}`
                  ? data.title
                  : (proposalDetails[data.proposalId]?.metadata?.title ??
                    data.title)}
              </Box>
            </Box>

            <ProposalListItemFinalState
              timestamp={data.state.timestamp}
              state={data.state.state}
            />
          </Box>
        </ProposalListItemWrapper>
      </Box>
    </div>
  );
}
