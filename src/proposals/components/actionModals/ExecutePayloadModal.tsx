import { InitialPayload } from '@bgd-labs/aave-governance-ui-helpers';
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

export function ExecutePayloadModal({
  isOpen,
  setIsOpen,
  proposalId,
  payload,
  withController,
}: ActionModalBasicTypes & {
  payload: InitialPayload;
  withController?: boolean;
}) {
  const executePayload = useRootStore((state) => state.executePayload);

  return (
    <ActionModal
      type={TxType.executePayload}
      payload={{
        proposalId,
        payloadId: payload.id,
        chainId: payload.chainId,
        payloadController: withController
          ? payload.payloadsController
          : undefined,
      }}
      callbackFunction={async () =>
        await executePayload(proposalId, payload, withController)
      }
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
