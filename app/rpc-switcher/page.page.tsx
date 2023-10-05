import { Metadata } from 'next';
import React from 'react';

import { RpcSwitcherPage } from '../../src/rpcSwitcher/components/RpcSwitcherPage';
import { metaTexts } from '../../src/ui/utils/metaTexts';

export const metadata: Metadata = {
  title: `${metaTexts.main}${metaTexts.rpcSwitcherPageMetaTitle}`,
  description: metaTexts.rpcSwitcherPageMetaDescription,
  openGraph: {
    images: ['/metaLogo.jpg'],
    title: `${metaTexts.main}${metaTexts.rpcSwitcherPageMetaTitle}`,
    description: metaTexts.rpcSwitcherPageMetaDescription,
  },
};

export default function Page() {
  return <RpcSwitcherPage />;
}
