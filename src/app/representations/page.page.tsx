import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { RepresentationsLoading } from '../../components/Representations/RepresentationsLoading';
import { RepresentationsPage } from '../../components/Representations/RepresentationsPage';
import { metaTexts } from '../../helpers/texts/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.representationsPageMetaTitle}`,
  description: metaTexts.representationsPageMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.main}${metaTexts.representationsPageMetaTitle}`,
    description: metaTexts.representationsPageMetaDescription,
  },
};

export default function Page() {
  return (
    <Suspense fallback={<RepresentationsLoading />}>
      <RepresentationsPage />
    </Suspense>
  );
}
