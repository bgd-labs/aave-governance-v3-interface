import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { RpcSwitcherLoading } from '../../components/RpcSwitcher/RpcSwitcherLoading';
import { RpcSwitcherPage } from '../../components/RpcSwitcher/RpcSwitcherPage';
import { metaTexts } from '../../helpers/texts/metaTexts';

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
  return (
    <Suspense fallback={<RpcSwitcherLoading />}>
      <RpcSwitcherPage />
    </Suspense>
  );
}
