import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { ActionModal } from '../../../transactions/components/ActionModal';
import { TxType } from '../../../transactions/store/transactionsSlice';
import { texts } from '../../../ui/utils/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from './ActionModalContentWrapper';
import { ActionModalBasicTypes } from './types';

export function CloseVotingModal({
  votingChainId,
  isOpen,
  setIsOpen,
  proposalId,
}: { votingChainId: number } & ActionModalBasicTypes) {
  const closeAndSendVote = useStore((state) => state.closeAndSendVote);

  return (
    <ActionModal
      type={TxType.closeAndSendVote}
      payload={{ proposalId }}
      callbackFunction={async () =>
        await closeAndSendVote(votingChainId, proposalId)
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      actionButtonTitle={texts.other.confirm}
      topBlock={<ActionModalTitle title={texts.proposalActions.closeVoting} />}
      withCancelButton>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.closeVotingDescription}
        </Box>
      </ActionModalContentWrapper>
    </ActionModal>
  );
}
