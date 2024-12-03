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

export function ExecuteProposalModal({
  isOpen,
  setIsOpen,
  proposalId,
}: ActionModalBasicTypes) {
  const executeProposal = useStore((state) => state.executeProposal);

  return (
    <ActionModal
      type={TxType.executeProposal}
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
