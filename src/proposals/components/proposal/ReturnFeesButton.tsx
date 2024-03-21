import {
  ProposalState,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers';
import { selectLastTxByTypeAndPayload } from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { zeroAddress } from 'viem';

import { useStore } from '../../../store';
import { useLastTxLocalStatus } from '../../../transactions/hooks/useLastTxLocalStatus';
import {
  TransactionUnion,
  TxType,
} from '../../../transactions/store/transactionsSlice';
import { SmallButton } from '../../../ui';
import { ReturnFeesTxModal } from '../../../web3/components/wallet/ReturnFeesTxModal';

interface ReturnFeesButtonProps {
  proposal: ProposalWithLoadings;
}

export function ReturnFeesButton({ proposal }: ReturnFeesButtonProps) {
  const store = useStore();
  const { activeWallet, returnFees } = store;

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    },
  });

  const handleReturnFees = async () => {
    setIsModalOpen(true);
    await executeTxWithLocalStatuses({
      callbackFunction: async () =>
        await returnFees(activeWallet?.address || zeroAddress, [
          proposal.proposal.data.id,
        ]),
    });
  };

  const txFromPool =
    activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      store,
      activeWallet.address,
      TxType.returnFees,
      {
        creator: activeWallet?.address,
        proposalIds: [proposal.proposal.data.id],
      },
    );

  if (!activeWallet) return null;

  return (
    <>
      {activeWallet.address.toLowerCase() ===
        proposal.proposal.data.creator.toLowerCase() && (
        <>
          <Box sx={{ ml: 8 }}>
            {proposal.proposal.data.isFinished &&
              proposal.proposal.data.cancellationFee > 0 &&
              proposal.proposal.data.state !== ProposalState.Cancelled && (
                <SmallButton
                  loading={txFromPool?.pending || loading || tx.pending}
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
