import { Metadata } from 'next';
import React from 'react';

import { DelegatePage } from '../../src/delegate/components/DelegatePage';
import { metaTexts } from '../../src/ui/utils/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.delegatePageMetaTitle}`,
  description: metaTexts.delegatePageMetaDescription,
  openGraph: {
    title: `${metaTexts.main}${metaTexts.delegatePageMetaTitle}`,
    description: metaTexts.delegatePageMetaDescription,
  },
};

export default function Page() {
  return <DelegatePage />;
}
