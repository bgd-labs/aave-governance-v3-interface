import { Box } from '@mui/system';
import React from 'react';

import { useStore } from '../../../store';
import { ActionModal } from '../../../transactions/components/ActionModal';
import { texts } from '../../../ui/utils/texts';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from './ActionModalContentWrapper';
import { ActionModalBasicTypes } from './types';

export function ExecuteProposalModal({
  isOpen,
  setIsOpen,
  proposalId,
}: ActionModalBasicTypes) {
  const executeProposal = useStore((state) => state.executeProposal);

  return (
    <ActionModal
      type="executeProposal"
      payload={{ proposalId }}
      callbackFunction={async () => await executeProposal(proposalId)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      actionButtonTitle={texts.other.confirm}
      topBlock={
        <ActionModalTitle title={texts.proposalActions.executeProposal} />
      }
      withCancelButton>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.executeProposalDescription}
        </Box>
      </ActionModalContentWrapper>
    </ActionModal>
  );
}
