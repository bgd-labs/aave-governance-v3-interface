'use client';

import { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import React, { useEffect } from 'react';

import { BasicModal } from '../../../../../../components/BasicModal';
import { PayloadDetailsContent } from '../../../../../../components/PayloadsExplorer/PayloadDetailsContent';
import { metaTexts } from '../../../../../../helpers/texts/metaTexts';
import { useStore } from '../../../../../../providers/ZustandStoreProvider';
import { api } from '../../../../../../trpc/react';
import { PayloadsExplorerPageParams } from '../../../payload/[payloadId]/page.appPage';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export default function Page({
  params,
}: {
  params: PayloadsExplorerPageParams;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const payload = api.payloads.getById.useQuery({
    chainWithController: params.payloadController,
    payloadId: Number(params.payloadId),
  });

  const isPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.isPayloadExplorerItemDetailsModalOpen,
  );
  const setIsPayloadExplorerItemDetailsModalOpen = useStore(
    (store) => store.setIsPayloadExplorerItemDetailsModalOpen,
  );

  useEffect(() => {
    if (payload.data) {
      if (pathname?.split('/').includes(String(payload.data.id))) {
        setIsPayloadExplorerItemDetailsModalOpen(true);
      }
      if (!pathname?.split('/').includes(String(payload.data.id))) {
        setIsPayloadExplorerItemDetailsModalOpen(false);
      }
    }
  }, [pathname, payload.data]);

  return (
    <BasicModal
      maxWidth={600}
      withCloseButton
      setIsOpen={() => {
        setIsPayloadExplorerItemDetailsModalOpen(false);
        router.back();
      }}
      isOpen={isPayloadExplorerItemDetailsModalOpen}>
      {!payload.data ? (
        <p>Loading</p>
      ) : (
        <PayloadDetailsContent payload={payload.data} withExecute />
      )}
    </BasicModal>
  );
}
