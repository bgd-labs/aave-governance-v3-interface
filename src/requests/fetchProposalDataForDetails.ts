import { IVotingPortal_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../configs/appConfig';
import { INITIAL_API_URL, ipfsGateway } from '../configs/configs';
import { getProposalMetadata } from '../helpers/getProposalMetadata';
import { texts } from '../helpers/texts/texts';
import {
  ContractsConstants,
  GetProposalInitialResponse,
  ProposalMetadata,
  VotingConfig,
} from '../types';
import {
  getProposalFormattedData,
  getProposalPayloadsFormattedData,
  getProposalVotingFormattedData,
} from './utils/formatDataFromAPI';
import { formatDataForDetails } from './utils/formatProposalData';
import { getPayloadsDataRPC } from './utils/getPayloadsDataRPC';
import { getProposalsDataRPC } from './utils/getProposalsDataRPC';
import { getVotingDataRPC } from './utils/getVotingDataRPC';

export type FetchProposalsDataForDetailsParams = Pick<
  ContractsConstants,
  'precisionDivider' | 'expirationTime' | 'cooldownPeriod'
> & {
  proposalId: number;
  votingConfigs: VotingConfig[];
  clients: Record<number, Client>;
};

export async function fetchProposalDataForDetails({
  input,
}: {
  input: FetchProposalsDataForDetailsParams;
}) {
  try {
    const url = `${INITIAL_API_URL}/proposals/${input.proposalId}/get/`;
    const dataRaw = await fetch(url);
    const data = (await dataRaw.json()) as GetProposalInitialResponse &
      ProposalMetadata;

    const config = input.votingConfigs.filter(
      (config) => config.accessLevel === data.accessLevel,
    )[0];

    let ipfsError = '';
    let metadata: ProposalMetadata = {
      title: data.title,
      description: data.description,
      discussions: data.discussions,
      author: data.creator,
      ipfsHash: data.ipfsHash,
    };
    if (!data.title) {
      try {
        metadata = await getProposalMetadata(data.ipfsHash, ipfsGateway);
      } catch (e) {
        ipfsError = texts.other.fetchFromIpfsError;
        console.error('Error getting ipfs data', e);
      }
    }

    const proposalData = getProposalFormattedData(data);
    const payloadsData = getProposalPayloadsFormattedData(data);
    const votingData = getProposalVotingFormattedData(data);

    const formattedData = formatDataForDetails({
      differential: config.differential,
      coolDownBeforeVotingStart: config.coolDownBeforeVotingStart,
      quorum: config.quorum,
      precisionDivider: input.precisionDivider,
      expirationTime: input.expirationTime,
      cooldownPeriod: input.cooldownPeriod,
      core: proposalData,
      payloads: payloadsData,
      voting: votingData,
      metadata,
      ipfsError,
    });

    return {
      proposalData,
      payloadsData: payloadsData.map((payload) => {
        return {
          ...payload,
          proposalId: Number(data.proposalId),
        };
      }),
      votingData,
      metadata,
      formattedData,
      ipfsError,
    };
  } catch (e) {
    console.error(
      'Error getting proposal details data from API, using RPC fallback',
      e,
    );
    const proposalData = (
      await getProposalsDataRPC({
        clients: input.clients,
        proposalsIds: [input.proposalId],
      })
    )[0];

    const payloadsChainsWithIds: Record<number, number[]> = {};
    const initialPayloads = proposalData.payloads;
    const payloadsChains = initialPayloads
      .map((payload) => payload.chain)
      .filter((value, index, self) => self.indexOf(value) === index);
    payloadsChains.forEach((chainId) => {
      payloadsChainsWithIds[Number(chainId)] = initialPayloads
        .filter((payload) => Number(payload.chain) === Number(chainId))
        .map((payload) => payload.payloadId)
        .filter((value, index, self) => self.indexOf(value) === index);
    });

    let ipfsError = '';
    let metadata: ProposalMetadata = {
      title: `Proposal ${proposalData.id}`,
      description: '',
      discussions: '',
      author: proposalData.creator,
      ipfsHash: proposalData.ipfsHash,
    };
    try {
      metadata = await getProposalMetadata(proposalData.ipfsHash, ipfsGateway);
    } catch (e) {
      ipfsError = texts.other.fetchFromIpfsError;
      console.error('Error getting ipfs data', e);
    }

    const [payloadsData, votingChainId] = await Promise.all([
      (
        await Promise.all(
          Object.entries(payloadsChainsWithIds).map(
            async ([chainId, payloadsIds]) =>
              await getPayloadsDataRPC({
                chainId: Number(chainId),
                payloadsIds,
                clients: input.clients,
              }),
          ),
        )
      ).flat(),
      await readContract(input.clients[appConfig.govCoreChainId], {
        abi: IVotingPortal_ABI,
        address: proposalData.votingPortal,
        functionName: 'VOTING_MACHINE_CHAIN_ID',
        args: [],
      }),
    ]);

    const votingData = (
      await getVotingDataRPC({
        initialProposals: [
          {
            id: BigInt(proposalData.id),
            votingChainId: Number(votingChainId),
            snapshotBlockHash: proposalData.snapshotBlockHash,
          },
        ],
        clients: input.clients,
      })
    )[0];

    const config = input.votingConfigs.filter(
      (config) => config.accessLevel === proposalData.accessLevel,
    )[0];

    const formattedData = formatDataForDetails({
      differential: config.differential,
      coolDownBeforeVotingStart: config.coolDownBeforeVotingStart,
      quorum: config.quorum,
      precisionDivider: input.precisionDivider,
      expirationTime: input.expirationTime,
      cooldownPeriod: input.cooldownPeriod,
      core: proposalData,
      payloads: payloadsData,
      voting: votingData,
      metadata,
      ipfsError,
    });

    return {
      proposalData,
      payloadsData: payloadsData.map((payload) => {
        return {
          ...payload,
          proposalId: Number(proposalData.id),
        };
      }),
      votingData,
      metadata,
      formattedData,
      ipfsError,
    };
  }
}
