import { ReactNode } from 'react';

import { ModalForExecute } from '../../components/PayloadsExplorer/ModalForExecute';
import { appConfig } from '../../configs/appConfig';

export type PayloadsExplorerPageParams = { payloadController: string };

export async function generateStaticParams() {
  const config = appConfig.payloadsControllerConfig;
  const allControllers: string[] = [];
  Object.entries(config).forEach(([chain, config]) => {
    config.contractAddresses.forEach((controller) =>
      allControllers.push(`${chain}_${controller}`),
    );
  });
  return allControllers
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((controller) => ({
      payloadController: controller,
      fallback: false,
    }));
}

export default function Layout({
  children,
  payloadsModal,
}: {
  children: ReactNode;
  payloadsModal: ReactNode;
}) {
  return (
    <>
      {children} {payloadsModal} <ModalForExecute />
    </>
  );
}
