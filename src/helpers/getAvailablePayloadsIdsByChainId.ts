import { appConfig } from '../configs/appConfig';
import { CreateProposalPageParams } from '../types';

export const getAvailablePayloadsIdsByChainId = ({
  chainId,
  proposalsCount,
  proposalsData,
  payloadsCount,
}: { chainId: number } & Pick<
  CreateProposalPageParams,
  'proposalsCount' | 'proposalsData' | 'payloadsCount'
>) => {
  const payloadsController =
    appConfig.payloadsControllerConfig[chainId].contractAddresses[0];

  const proposalsIds =
    proposalsCount >= 0
      ? Array.from(Array(proposalsCount).keys()).sort((a, b) => b - a)
      : [];

  const detailedData = proposalsIds.map(
    (id) => proposalsData.filter((proposal) => proposal.id === id)[0],
  );

  const allPayloadsIds = Array.from(
    Array(payloadsCount[payloadsController]).keys(),
  ).sort((a, b) => b - a);

  if (detailedData.length) {
    const allUsedPayloadsIds = detailedData
      .map(
        (proposal) =>
          proposal &&
          proposal.payloads.filter(
            (payload) => payload.payloadsController === payloadsController,
          ),
      )
      .flat()
      .map((payload) => payload?.payloadId)
      .filter((element, index, self) => self.indexOf(element) === index);

    return allPayloadsIds.filter((id) => allUsedPayloadsIds.indexOf(id) === -1);
  } else {
    return allPayloadsIds;
  }
};
