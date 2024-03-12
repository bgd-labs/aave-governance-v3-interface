import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { PayloadsExplorerPage } from '../../src/payloadsExplorer/components/PayloadsExplorerPage';
import { metaTexts } from '../../src/ui/utils/metaTexts';

export const metadata: Metadata = {
  title: metaTexts.ipfsTitle,
  description: metaTexts.ipfsDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: metaTexts.ipfsTitle,
    description: metaTexts.ipfsDescription,
  },
};

export default function PayloadsExplorer() {
  return (
    <Suspense>
      <PayloadsExplorerPage />
    </Suspense>
  );
}
