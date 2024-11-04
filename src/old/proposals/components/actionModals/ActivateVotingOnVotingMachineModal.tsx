import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store/ZustandStoreProvider';
import { ActionModal } from '../../../transactions/components/ActionModal';
import { TxType } from '../../../transactions/store/transactionsSlice';
import { getChainName } from '../../../ui/utils/getChainName';
import { texts } from '../../../ui/utils/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from './ActionModalContentWrapper';
import { ActionModalBasicTypes } from './types';

export function ActivateVotingOnVotingMachineModal({
  votingChainId,
  isOpen,
  setIsOpen,
  proposalId,
}: { votingChainId: number } & ActionModalBasicTypes) {
  const activateVotingOnVotingMachine = useStore(
    (state) => state.activateVotingOnVotingMachine,
  );

  return (
    <ActionModal
      type={TxType.activateVotingOnVotingMachine}
      payload={{ proposalId }}
      callbackFunction={async () =>
        await activateVotingOnVotingMachine(votingChainId, proposalId)
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      actionButtonTitle={texts.other.confirm}
      topBlock={
        <ActionModalTitle title={texts.proposalActions.activateVoting} />
      }
      withCancelButton>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.activateVotingDescription}{' '}
          {getChainName(votingChainId)} chain
        </Box>
      </ActionModalContentWrapper>
    </ActionModal>
  );
}
