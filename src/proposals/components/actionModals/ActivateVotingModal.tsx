import { Box } from '@mui/system';
import React from 'react';

import { useRootStore } from '../../../store/storeProvider';
import { ActionModal } from '../../../transactions/components/ActionModal';
import { TxType } from '../../../transactions/store/transactionsSlice';
import { texts } from '../../../ui/utils/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from './ActionModalContentWrapper';
import { ActionModalBasicTypes } from './types';

export function ActivateVotingModal({
  isOpen,
  setIsOpen,
  proposalId,
}: ActionModalBasicTypes) {
  const activateVoting = useRootStore((state) => state.activateVoting);

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
