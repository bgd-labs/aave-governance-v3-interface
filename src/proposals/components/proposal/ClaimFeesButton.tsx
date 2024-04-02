import {
  ProposalState,
  ProposalWithLoadings,
} from '@bgd-labs/aave-governance-ui-helpers';
import { selectLastTxByTypeAndPayload } from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { zeroAddress } from 'viem';

import { useRootStore } from '../../../store/storeProvider';
import { useLastTxLocalStatus } from '../../../transactions/hooks/useLastTxLocalStatus';
import {
  TransactionUnion,
  TxType,
} from '../../../transactions/store/transactionsSlice';
import { SmallButton } from '../../../ui';
import { texts } from '../../../ui/utils/texts';
import { CreationFeesTxModal } from '../../../web3/components/creationFee/CreationFeesTxModal';

interface ClaimFeesButtonProps {
  proposal: ProposalWithLoadings;
}

export function ClaimFeesButton({ proposal }: ClaimFeesButtonProps) {
  const transactionsPool = useRootStore((store) => store.transactionsPool);
  const activeWallet = useRootStore((store) => store.activeWallet);
  const redeemCancellationFee = useRootStore(
    (store) => store.redeemCancellationFee,
  );

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
    type: TxType.claimFees,
    payload: {
      creator: activeWallet?.address,
      proposalIds: [proposal.proposal.data.id],
    },
  });

  const handleReturnFees = async () => {
    setIsModalOpen(true);
    await executeTxWithLocalStatuses({
      callbackFunction: async () =>
        await redeemCancellationFee(activeWallet?.address || zeroAddress, [
          proposal.proposal.data.id,
        ]),
    });
  };

  const txFromPool =
    activeWallet &&
    selectLastTxByTypeAndPayload<TransactionUnion>(
      transactionsPool,
      activeWallet.address,
      TxType.claimFees,
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
          <Box sx={{ ml: 8, '.SmallButton': { minWidth: '132px !important' } }}>
            {proposal.proposal.data.isFinished &&
              proposal.proposal.data.cancellationFee > 0 &&
              proposal.proposal.data.state !== ProposalState.Cancelled && (
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
            proposalIds={[proposal.proposal.data.id]}
            tx={tx}
            fullTxErrorMessage={fullTxErrorMessage}
          />
        </>
      )}
    </>
  );
}
