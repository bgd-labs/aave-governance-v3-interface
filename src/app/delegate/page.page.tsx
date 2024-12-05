import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { DelegateLoading } from '../../components/Delegate/DelegateLoading';
import { DelegatePage } from '../../components/Delegate/DelegatePage';
import { metaTexts } from '../../helpers/texts/metaTexts';

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
  return (
    <Suspense fallback={<DelegateLoading />}>
      <DelegatePage />
    </Suspense>
  );
}
