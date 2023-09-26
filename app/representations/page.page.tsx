import { Metadata } from 'next';
import React from 'react';

import { RepresentationsPage } from '../../src/representations/components/RepresentationsPage';
import { texts } from '../../src/ui/utils/texts';

export const metadata: Metadata = {
  title: `${texts.meta.main}${texts.meta.representationsPageMetaTitle}`,
  description: texts.meta.representationsPageMetaDescription,
  openGraph: {
    title: `${texts.meta.main}${texts.meta.representationsPageMetaTitle}`,
    description: texts.meta.representationsPageMetaDescription,
  },
};

export default function Page() {
  return <RepresentationsPage />;
}
