'use client';

import { useRouter } from 'nextjs-toploader/app';
import React, { useEffect } from 'react';
import useSWR from 'swr';

import { BasicModal } from '../../../../../components/BasicModal';
import { PayloadDetailsContent } from '../../../../../components/PayloadsExplorer/PayloadDetailsContent';
import { PayloadExploreItemLoading } from '../../../../../components/PayloadsExplorer/PayloadExploreItemLoading';
import { useStore } from '../../../../../providers/ZustandStoreProvider';
import { payloadByIdFetcher } from '../../../../../requests/fetchers/payloadByIdFetcher';
import { selectAppClients } from '../../../../../store/selectors/rpcSwitcherSelectors';
import { PayloadsExplorerPageParams } from '../../../payload/[payloadId]/page.appPage';

export default function Page({
  params,
}: {
  params: PayloadsExplorerPageParams;
}) {
  const router = useRouter();

  const splitParams = params.payloadId.split('_');
  const inputParams = {
    chainWithController: `${splitParams[1]}_${splitParams[2]}`,
    payloadId: Number(splitParams[0]),
  };
  const clients = useStore((store) => selectAppClients(store));
  const { data: payload } = useSWR(
    {
      ...inputParams,
      clients,
    },
    payloadByIdFetcher,
    {
      refreshInterval: 30_000,
    },
  );

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
      {!payload ? (
        <PayloadExploreItemLoading isColumns={true} />
      ) : (
        <PayloadDetailsContent payload={payload} withExecute />
      )}
    </BasicModal>
  );
}
