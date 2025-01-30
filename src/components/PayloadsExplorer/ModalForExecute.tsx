'use client';

import { useStore } from '../../providers/ZustandStoreProvider';
import { ExecutePayloadModal } from '../../transactions/components/ActionModals/ExecutePayloadModal';

export function ModalForExecute() {
  const isExecutePayloadModalOpen = useStore(
    (store) => store.isExecutePayloadModalOpen,
  );
  const setExecutePayloadModalOpen = useStore(
    (store) => store.setExecutePayloadModalOpen,
  );
  const selectedPayloadForExecute = useStore(
    (store) => store.selectedPayloadForExecute,
  );

  return (
    selectedPayloadForExecute && (
      <ExecutePayloadModal
        isOpen={isExecutePayloadModalOpen}
        setIsOpen={setExecutePayloadModalOpen}
        proposalId={0}
        payload={selectedPayloadForExecute}
        withController
      />
    )
  );
}
