'use client';

import { useRouter } from 'nextjs-toploader/app';
import React, { useEffect } from 'react';

import { BasicModal } from '../../../../../components/BasicModal';
import { PayloadDetailsContent } from '../../../../../components/PayloadsExplorer/PayloadDetailsContent';
import { PayloadExploreItemLoading } from '../../../../../components/PayloadsExplorer/PayloadExploreItemLoading';
import { useStore } from '../../../../../providers/ZustandStoreProvider';
import { api } from '../../../../../trpc/react';
import { PayloadsExplorerPageParams } from '../../../payload/[payloadId]/page.appPage';

export default function Page({
  params,
}: {
  params: PayloadsExplorerPageParams;
}) {
  const router = useRouter();

  const splitParams = params.payloadId.split('_');
  const payload = api.payloads.getById.useQuery({
    chainWithController: `${splitParams[1]}_${splitParams[2]}`,
    payloadId: Number(splitParams[0]),
  });

  const isPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.isPayloadExplorerItemDetailsModalOpen,
  );
  const setIsPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.setIsPayloadExplorerItemDetailsModalOpen,
  );

  useEffect(() => {
    setIsPayloadExplorerItemDetailsModalOpen(true);
    return () => setIsPayloadExplorerItemDetailsModalOpen(false);
  }, []);

  return (
    <BasicModal
      maxWidth={420}
      withCloseButton
      setIsOpen={() => {
        setIsPayloadExplorerItemDetailsModalOpen(false);
        router.back();
      }}
      isOpen={isPayloadExplorerItemDetailsModalOpen}>
      {!payload.data ? (
        <PayloadExploreItemLoading isColumns={true} />
      ) : (
        <PayloadDetailsContent payload={payload.data} withExecute />
      )}
    </BasicModal>
  );
}
