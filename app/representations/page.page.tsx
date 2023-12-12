import { Metadata } from 'next';
import React from 'react';

import { RepresentationsPage } from '../../src/representations/components/RepresentationsPage';
import { ComingSoonPage } from '../../src/ui/pages/ComingSoonPage';
import { metaTexts } from '../../src/ui/utils/metaTexts';

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
  // return <RepresentationsPage />;
  return <ComingSoonPage />;
}
