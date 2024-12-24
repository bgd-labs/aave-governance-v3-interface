import { Metadata } from 'next';
import { ReactNode } from 'react';

import { ModalForExecute } from '../../components/PayloadsExplorer/ModalForExecute';
import { metaTexts } from '../../helpers/texts/metaTexts';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export default function Layout({
  children,
  payloadsModal,
}: {
  children: ReactNode;
  payloadsModal: ReactNode;
}) {
  return (
    <>
      {children}
      {payloadsModal}
      <ModalForExecute />
    </>
  );
}
