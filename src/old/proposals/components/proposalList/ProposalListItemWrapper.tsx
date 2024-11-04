import { ProposalEstimatedState } from '@bgd-labs/aave-governance-ui-helpers';
import { useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { BoxWith3D } from '../../../ui';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';

export function ProposalListItemWrapper({
  children,
  isVotingActive,
  estimatedState,
  isFinished,
  isForHelpModal,
  disabled,
}: {
  children: ReactNode;
  isVotingActive?: boolean;
  estimatedState?: ProposalEstimatedState;
  isFinished?: boolean;
  isForHelpModal?: boolean;
  disabled?: boolean;
}) {
  const sm = useMediaQuery(media.sm);
  const md = useMediaQuery(media.md);
  const theme = useTheme();

  return (
    <BoxWith3D
      disabled={md && disabled}
      alwaysWithBorders={isForHelpModal}
      withActions={(!sm && !isForHelpModal) || !isForHelpModal}
      borderSize={10}
      disableActiveState={isVotingActive}
      contentColor="$mainLight"
      bottomBorderColor={
        estimatedState === ProposalEstimatedState.Failed && !isFinished
          ? '$secondaryAgainst'
          : estimatedState === ProposalEstimatedState.Succeed && !isFinished
            ? '$secondaryFor'
            : '$light'
      }
      wrapperCss={{
        mb: 18,
        position: 'relative',
        [theme.breakpoints.up('sm')]: { mb: 24 },
        '&:hover': isForHelpModal
          ? undefined
          : {
              zIndex: 10,
            },
      }}
      css={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        p: '18px',
        [theme.breakpoints.up('sm')]: {
          p: '18px 24px',
        },
        [theme.breakpoints.up('lg')]: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '22px 30px',
          minHeight: isFinished ? 0 : 144,
        },
      }}>
      {children}
    </BoxWith3D>
  );
}
