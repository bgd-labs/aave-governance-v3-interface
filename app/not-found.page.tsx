import { Metadata } from 'next';
import React from 'react';

import { NotFoundPage } from '../src/ui/pages/NotFoundPage';
import { metaTexts } from '../src/ui/utils/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.notFoundPageMetaTitle}`,
  description: metaTexts.notFoundPageMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.main}${metaTexts.notFoundPageMetaTitle}`,
    description: metaTexts.notFoundPageMetaDescription,
  },
};

export default function NotFound() {
  return <NotFoundPage />;
}
