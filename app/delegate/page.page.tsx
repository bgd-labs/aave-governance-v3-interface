import { Metadata } from 'next';
import React from 'react';

import { DelegatePage } from '../../src/delegate/components/DelegatePage';
import { ComingSoonPage } from '../../src/ui/pages/ComingSoonPage';
import { metaTexts } from '../../src/ui/utils/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.delegatePageMetaTitle}`,
  description: metaTexts.delegatePageMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.main}${metaTexts.delegatePageMetaTitle}`,
    description: metaTexts.delegatePageMetaDescription,
  },
};

export default function Page() {
  // return <DelegatePage />;
  return <ComingSoonPage />;
}
