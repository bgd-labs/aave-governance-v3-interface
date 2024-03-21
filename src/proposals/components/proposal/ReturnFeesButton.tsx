import {
  CombineProposalState,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { zeroAddress } from 'viem';

import { useStore } from '../../../store';
import { useLastTxLocalStatus } from '../../../transactions/hooks/useLastTxLocalStatus';
import { TxType } from '../../../transactions/store/transactionsSlice';
import { SmallButton } from '../../../ui';
import { ReturnFeesTxModal } from '../../../web3/components/wallet/ReturnFeesTxModal';

interface ReturnFeesButtonProps {
  proposal: ProposalWithLoadings;
}

export function ReturnFeesButton({ proposal }: ReturnFeesButtonProps) {
  const store = useStore();
  const { activeWallet, returnFees } = store;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timestampTx] = useState(dayjs().unix());

  const {
    error,
    setError,
    loading,
    isTxStart,
    setIsTxStart,
    setFullTxErrorMessage,
    fullTxErrorMessage,
    executeTxWithLocalStatuses,
    tx,
  } = useLastTxLocalStatus({
    type: TxType.returnFees,
    payload: {
      creator: activeWallet?.address,
      proposalIds: [proposal.proposal.data.id],
      timestamp: timestampTx,
    },
  });

  const handleReturnFees = async () => {
    setIsModalOpen(true);
    await executeTxWithLocalStatuses({
      callbackFunction: async () =>
        await returnFees(
          activeWallet?.address || zeroAddress,
          [proposal.proposal.data.id],
          timestampTx,
        ),
    });
  };

  if (!activeWallet) return null;

  return (
    <>
      {activeWallet.address.toLowerCase() ===
        proposal.proposal.data.creator.toLowerCase() && (
        <>
          <Box sx={{ ml: 8 }}>
            {proposal.proposal.data.isFinished &&
              proposal.proposal.data.cancellationFee > 0 &&
              (proposal.proposal.combineState ===
                CombineProposalState.Executed ||
                proposal.proposal.combineState ===
                  CombineProposalState.Failed) && (
                <SmallButton
                  loading={loading || tx.pending}
                  onClick={handleReturnFees}>
                  Return fee
                </SmallButton>
              )}
          </Box>

          <ReturnFeesTxModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            setFullTxErrorMessage={setFullTxErrorMessage}
            isTxStart={isTxStart}
            setIsTxStart={setIsTxStart}
            error={error}
            setError={setError}
            proposalIds={[proposal.proposal.data.id]}
            tx={tx}
            fullTxErrorMessage={fullTxErrorMessage}
          />
        </>
      )}
    </>
  );
}
