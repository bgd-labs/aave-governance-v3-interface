import { Metadata } from 'next';
import React from 'react';

import { NotFoundPage } from '../src/ui/pages/NotFoundPage';
import { texts } from '../src/ui/utils/texts';

export const metadata: Metadata = {
  title: `${texts.meta.main}${texts.meta.notFoundPageMetaTitle}`,
  description: texts.meta.notFoundPageMetaDescription,
  openGraph: {
    title: `${texts.meta.main}${texts.meta.notFoundPageMetaTitle}`,
    description: texts.meta.notFoundPageMetaDescription,
  },
};

export default function NotFound() {
  return <NotFoundPage />;
}
