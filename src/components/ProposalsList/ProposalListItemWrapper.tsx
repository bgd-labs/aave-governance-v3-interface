'use client';

import { useTheme } from '@mui/system';
import React, { ReactNode } from 'react';

import { media } from '../../styles/themeMUI';
import { useMediaQuery } from '../../styles/useMediaQuery';
import { ProposalNextState } from '../../types';
import { BoxWith3D } from '../BoxWith3D';

export function ProposalListItemWrapper({
  children,
  isVotingActive,
  nextState,
  isFinished,
  isForHelpModal,
  disabled,
  className,
}: {
  children: ReactNode;
  isVotingActive?: boolean;
  nextState?: ProposalNextState;
  isFinished?: boolean;
  isForHelpModal?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const sm = useMediaQuery(media.sm);
  const md = useMediaQuery(media.md);
  const theme = useTheme();

  return (
    <BoxWith3D
      className={className}
      disabled={md && disabled}
      alwaysWithBorders={isForHelpModal}
      withActions={(!sm && !isForHelpModal) || !isForHelpModal}
      borderSize={10}
      disableActiveState={isVotingActive}
      contentColor="$mainLight"
      bottomBorderColor={
        nextState === ProposalNextState.Failed && !isFinished
          ? '$secondaryAgainst'
          : nextState === ProposalNextState.Succeed && !isFinished
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
