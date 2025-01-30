import { Box } from '@mui/system';
import React from 'react';

import { texts } from '../../../helpers/texts/texts';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { TxType } from '../../../store/transactionsSlice';
import { ActionModal } from '../ActionModal';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../ActionModalContentWrapper';
import { ActionModalBasicTypes } from './types';

export function ActivateVotingModal({
  isOpen,
  setIsOpen,
  proposalId,
}: ActionModalBasicTypes) {
  const activateVoting = useStore((state) => state.activateVoting);

  return (
    <ActionModal
      type={TxType.activateVoting}
      payload={{ proposalId }}
      callbackFunction={async () => await activateVoting(proposalId)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      actionButtonTitle={texts.other.confirm}
      topBlock={
        <ActionModalTitle title={texts.proposalActions.activateVoting} />
      }
      withCancelButton>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.activateVotingDescription}
        </Box>
      </ActionModalContentWrapper>
    </ActionModal>
  );
}
