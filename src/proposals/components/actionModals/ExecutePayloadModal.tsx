import { InitialPayload } from '@bgd-labs/aave-governance-ui-helpers/src';
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

export function ExecutePayloadModal({
  isOpen,
  setIsOpen,
  proposalId,
  payload,
}: ActionModalBasicTypes & {
  payload: InitialPayload;
}) {
  const executePayload = useStore((state) => state.executePayload);

  return (
    <ActionModal
      type="executePayload"
      payload={{
        proposalId,
        payloadId: payload.id,
        chainId: payload.chainId,
      }}
      callbackFunction={async () => await executePayload(proposalId, payload)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      actionButtonTitle={texts.other.confirm}
      topBlock={
        <ActionModalTitle title={texts.proposalActions.executePayload} />
      }
      withCancelButton>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {texts.proposalActions.executePayloadDescription}
        </Box>
      </ActionModalContentWrapper>
    </ActionModal>
  );
}
