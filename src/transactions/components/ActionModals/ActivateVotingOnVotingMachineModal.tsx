import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
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
