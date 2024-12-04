import { Metadata } from 'next';
import React from 'react';

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
  return <RepresentationsPage />;
}
