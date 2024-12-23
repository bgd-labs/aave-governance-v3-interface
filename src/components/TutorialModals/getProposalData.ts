import dayjs from 'dayjs';
import { zeroAddress } from 'viem';
import { polygon } from 'viem/chains';

import { appConfig } from '../../configs/appConfig';
import {
  ContractsConstants,
  InitialProposalState,
  PayloadInitialStruct,
  ProposalInitialStruct,
  VMProposalInitialStruct,
  VotingConfig,
  VotingDataByUser,
} from '../../types';

export function getProposalData() {
  return {
    config: {
      accessLevel: 1,
      votingDuration: 0,
      quorum: 200n,
      differential: 50n,
      coolDownBeforeVotingStart: 600,
      minPropositionPower: 5n,
    } as VotingConfig,
    constants: {
      precisionDivider: 1000000000000000000n,
      cooldownPeriod: 600n,
      expirationTime: 2592000n,
      cancellationFee: 0n,
    } as ContractsConstants,
    payloads: [
      {
        id: 0n,
        chain: BigInt(polygon.id),
        payloadsController:
          appConfig.payloadsControllerConfig[polygon.id].contractAddresses[0],
        data: {
          creator: zeroAddress,
          maximumAccessLevelRequired: 1,
          state: 1,
          createdAt: dayjs().unix() - 1300,
          queuedAt: 0,
          executedAt: 0,
          cancelledAt: 0,
          expirationTime: 0,
          delay: 0,
          gracePeriod: 0,
          actions: [],
        },
      },
    ] as PayloadInitialStruct[],
    metadata: {
      title: 'Tutorial proposal',
      description: 'Tutorial proposal',
      ipfsHash:
        '0x0a387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77',
      discussions: '',
      author: '0xAd9A211D227d2D9c1B5573f73CDa0284b758Ac0C',
    },
    proposalData: {
      payloads: [
        {
          payloadId: 0,
          chain: BigInt(polygon.id),
          payloadsController:
            appConfig.payloadsControllerConfig[polygon.id].contractAddresses[0],
          accessLevel: 1,
        },
      ],
      id: 1,
      title: 'Tutorial proposal',
      state: InitialProposalState.Active,
      accessLevel: 1,
      creationTime: dayjs().unix() - 1200,
      votingDuration: 600,
      creator: '0xAd9A211D227d2D9c1B5573f73CDa0284b758Ac0C',
      votingActivationTime: dayjs().unix() - 600,
      queuingTime: 0,
      ipfsHash:
        '0x0a387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77',
      forVotes: 0n,
      againstVotes: 0n,
      cancellationFee: 0n,
      cancelTimestamp: 0,
      votingPortal: zeroAddress,
      snapshotBlockHash:
        '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
    } as ProposalInitialStruct,
    votingData: {
      votingChainId: polygon.id,
      votingAssets: [
        appConfig.additional.aaveAddress,
        appConfig.additional.aAaveAddress,
        appConfig.additional.stkAAVEAddress,
      ],
      votedInfo: {
        support: false,
        votingPower: 0n,
      },
      hasRequiredRoots: true,
      strategy: '0x72468fB2181da0E647885824feC0906F1aAb327B',
      dataWarehouse: zeroAddress,
      state: 1,
      voteConfig: {
        votingDuration: 600,
        l1ProposalBlockHash:
          '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
      },
      proposalData: {
        id: 1n,
        forVotes: 0n,
        againstVotes: 0n,
        startTime: dayjs().unix(),
        endTime: dayjs().unix() + 600,
        votingClosedAndSentBlockNumber: 0n,
        votingClosedAndSentTimestamp: 0,
        l1BlockHash:
          '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
        sentToGovernance: false,
        creationBlockNumber: 1n,
      },
    } as VMProposalInitialStruct,
    balances: [
      {
        blockHash:
          '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
        asset: appConfig.additional.aaveAddress,
        votingPower: 2500000000000000000000n,
        isWithDelegatedPower: false,
        userBalance: 2500000000000000000000n,
      },
      {
        blockHash:
          '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
        asset: appConfig.additional.aAaveAddress,
        votingPower: 1500000000000000000000n,
        isWithDelegatedPower: false,
        userBalance: 1500000000000000000000n,
      },
      {
        blockHash:
          '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
        asset: appConfig.additional.stkAAVEAddress,
        votingPower: 500000000000000000000n,
        isWithDelegatedPower: false,
        userBalance: 500000000000000000000n,
      },
    ] as VotingDataByUser[],
  };
}
