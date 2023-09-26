import { Metadata } from 'next';
import React from 'react';

import { DelegatePage } from '../../src/delegate/components/DelegatePage';
import { texts } from '../../src/ui/utils/texts';

export const metadata: Metadata = {
  title: `${texts.meta.main}${texts.meta.delegatePageMetaTitle}`,
  description: texts.meta.delegatePageMetaDescription,
  openGraph: {
    title: `${texts.meta.main}${texts.meta.delegatePageMetaTitle}`,
    description: texts.meta.delegatePageMetaDescription,
  },
};

export default function Page() {
  return <DelegatePage />;
}
