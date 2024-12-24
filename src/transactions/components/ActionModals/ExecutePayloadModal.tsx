import { Box } from '@mui/system';
import React from 'react';

import { texts } from '../../../helpers/texts/texts';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { TxType } from '../../../store/transactionsSlice';
import { InitialPayload } from '../../../types';
import { ActionModal } from '../ActionModal';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../ActionModalContentWrapper';
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
  const executePayload = useStore((state) => state.executePayload);

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
        await executePayload({ proposalId, payload, withController })
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
