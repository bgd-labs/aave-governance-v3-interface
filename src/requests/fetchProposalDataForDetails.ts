import { IVotingPortal_ABI } from '@bgd-labs/aave-address-book/abis';
import { Client } from 'viem';
import { readContract } from 'viem/actions';

import { appConfig } from '../configs/appConfig';
import { ipfsGateway } from '../configs/configs';
import { getProposalMetadata } from '../helpers/getProposalMetadata';
import { texts } from '../helpers/texts/texts';
import { ContractsConstants, ProposalMetadata, VotingConfig } from '../types';
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
    throw new Error('TODO: API not implemented');
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
