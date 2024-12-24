import { selectLastTxByTypeAndPayload } from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React, { useState } from 'react';

import { texts } from '../../helpers/texts/texts';
import { useLastTxLocalStatus } from '../../hooks/useLastTxLocalStatus';
import { useStore } from '../../providers/ZustandStoreProvider';
import { TransactionUnion, TxType } from '../../store/transactionsSlice';
import { CreationFeesTxModal } from '../../transactions/components/ActionModals/CreationFeesTxModal';
import { InitialProposalState, ProposalInitialStruct } from '../../types';
import { SmallButton } from '../SmallButton';

interface ClaimFeesButtonProps {
  proposal: ProposalInitialStruct;
  isFinished: boolean;
}

export function ClaimFeesButton({
  proposal,
  isFinished,
}: ClaimFeesButtonProps) {
  const transactionsPool = useStore((store) => store.transactionsPool);
  const activeWallet = useStore((store) => store.activeWallet);
  const redeemCancellationFee = useStore(
    (store) => store.redeemCancellationFee,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const txPayload = {
    creator: proposal.creator,
    proposalsIds: [proposal.id],
  };

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
    type: TxType.claimFees,
    payload: txPayload,
  });

  const handleReturnFees = async () => {
    setIsModalOpen(true);
    await executeTxWithLocalStatuses({
      callbackFunction: async () => await redeemCancellationFee(txPayload),
    });
  };

  const txFromPool =
    activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      transactionsPool,
      activeWallet.address,
      TxType.claimFees,
      {
        creator: proposal.creator,
        proposalsIds: [proposal.id],
      },
    );

  if (!activeWallet) return null;

  return (
    <>
      {activeWallet.address.toLowerCase() ===
        proposal.creator.toLowerCase() && (
        <>
          <Box sx={{ ml: 8, '.SmallButton': { minWidth: '132px !important' } }}>
            {isFinished &&
              proposal.cancellationFee > 0 &&
              proposal.state !== InitialProposalState.Cancelled && (
                <SmallButton
                  loading={txFromPool?.pending || loading || tx.pending}
                  onClick={handleReturnFees}>
                  {texts.creationFee.title}
                </SmallButton>
              )}
          </Box>

          <CreationFeesTxModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            setFullTxErrorMessage={setFullTxErrorMessage}
            isTxStart={isTxStart}
            setIsTxStart={setIsTxStart}
            error={error}
            setError={setError}
            proposalsIds={[proposal.id]}
            tx={tx}
            fullTxErrorMessage={fullTxErrorMessage}
          />
        </>
      )}
    </>
  );
}
