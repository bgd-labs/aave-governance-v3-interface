import { Box } from '@mui/system';
import React from 'react';

import { getAssetNameByAddress } from '../../../helpers/getAssetName';
import { texts } from '../../../helpers/texts/texts';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { TxType } from '../../../store/transactionsSlice';
import { ActionModal } from '../ActionModal';
import {
  ActionModalContentWrapper,
  ActionModalTitle,
} from '../ActionModalContentWrapper';
import { ActionModalBasicTypes } from './types';

interface SendProofsModalProps extends ActionModalBasicTypes {
  blockHash: string;
  underlyingAsset: string;
  votingChainId: number;
  baseBalanceSlotRaw: number;
  withSlot?: boolean;
}

export function SendProofsModal({
  isOpen,
  setIsOpen,
  proposalId,
  votingChainId,
  blockHash,
  underlyingAsset,
  baseBalanceSlotRaw,
  withSlot,
}: SendProofsModalProps) {
  const sendProofs = useStore((state) => state.sendProofs);

  return (
    <ActionModal
      type={TxType.sendProofs}
      payload={{ proposalId, blockHash, underlyingAsset, withSlot }}
      callbackFunction={async () =>
        await sendProofs({
          votingChainId,
          proposalId,
          snapshotBlockHash: blockHash,
          asset: underlyingAsset,
          baseBalanceSlotRaw,
          withSlot,
        })
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      actionButtonTitle={texts.other.confirm}
      topBlock={
        <ActionModalTitle
          title={`Send ${getAssetNameByAddress(underlyingAsset)} ${
            withSlot ? 'slot' : 'root'
          }`}
        />
      }
      withCancelButton>
      <ActionModalContentWrapper>
        <Box component="p" sx={{ typography: 'body' }}>
          {withSlot ? 'Slot' : 'Root'} will be send
        </Box>
      </ActionModalContentWrapper>
    </ActionModal>
  );
}
