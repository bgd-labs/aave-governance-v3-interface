import { ClientsRecord } from '@bgd-labs/frontend-web3-utils';

import { PayloadParams } from '../components/pages/ProposalCreateOverviewPage';
import { ipfsGateway } from '../configs/configs';
import { generateSeatbeltLink } from '../helpers/formatPayloadData';
import { getProposalMetadata } from '../helpers/getProposalMetadata';
import { texts } from '../helpers/texts/texts';
import { PayloadWithHashes, ProposalMetadata } from '../types';
import { getPayloadsDataRPC } from './utils/getPayloadsDataRPC';

export type FetchDataForCreateOverviewScreen = {
  ipfsHash: string;
  payloads: PayloadParams[];
  clients: ClientsRecord;
};

export async function fetchDataForCreateOverviewScreen({
  input,
}: {
  input: FetchDataForCreateOverviewScreen;
}) {
  const { clients, ipfsHash, payloads } = input;

  try {
    throw new Error('TODO: API not implemented');
  } catch (e) {
    console.error(
      'Error getting data for create overview screen from API, using RPC fallback',
      e,
    );
    let ipfsData: ProposalMetadata | undefined = undefined;
    let ipfsError = '';
    try {
      ipfsData = await getProposalMetadata(ipfsHash, ipfsGateway);
    } catch (e) {
      ipfsError = texts.other.fetchFromIpfsError;
      console.error('Error getting ipfs data', e);
    }

    const payloadsChainsWithIds: Record<number, number[]> = {};
    const payloadsChains = payloads
      .map((payload) => payload.chainId)
      .filter((value, index, self) => self.indexOf(value) === index);
    payloadsChains.forEach((chainId) => {
      payloadsChainsWithIds[Number(chainId)] = payloads
        .filter((payload) => Number(payload.chainId) === Number(chainId))
        .map((payload) => payload.payloadId)
        .filter((value, index, self) => self.indexOf(value) === index);
    });
    const payloadsData = (
      await Promise.all(
        Object.entries(payloadsChainsWithIds).map(
          async ([chainId, payloadsIds]) =>
            await getPayloadsDataRPC({
              chainId: Number(chainId),
              payloadsIds,
              clients,
            }),
        ),
      )
    ).flat();

    const formattedPayloads: PayloadWithHashes[] = await Promise.all(
      payloadsData.map(async (payload) => {
        const seatbeltMD = await fetch(generateSeatbeltLink(payload));
        return {
          ...payload,
          seatbeltMD: seatbeltMD.ok ? await seatbeltMD.text() : undefined,
        };
      }),
    );

    return {
      ipfsData,
      payloads: formattedPayloads,
      ipfsError,
    };
  }
}
