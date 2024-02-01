import { ProposalWithLoadings } from '@bgd-labs/aave-governance-ui-helpers';
import dayjs from 'dayjs';
import { zeroAddress } from 'viem';

import { appConfig } from '../../utils/appConfig';
import { getAssetName } from '../../utils/getAssetName';

export function getProposalData() {
  return {
    loading: false,
    balanceLoading: false,
    proposal: {
      data: {
        id: 0,
        votingDuration: 600,
        creationTime: dayjs().unix() - 1200,
        accessLevel: 1,
        state: 2,
        queuingTime: 0,
        ipfsHash:
          '0x0a387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77',
        initialPayloads: [
          {
            id: 0,
            chainId: appConfig.govCoreChainId,
            payloadsController:
              appConfig.payloadsControllerConfig[appConfig.govCoreChainId]
                .contractAddresses[0],
          },
        ],
        snapshotBlockHash:
          '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
        creator: '0xAd9A211D227d2D9c1B5573f73CDa0284b758Ac0C',
        canceledAt: 0,
        votingActivationTime: dayjs().unix() - 600,
        votingChainId: appConfig.govCoreChainId,
        isFinished: false,
        votingMachineData: {
          id: 0,
          forVotes: '0',
          againstVotes: '0',
          startTime: dayjs().unix(),
          endTime: dayjs().unix() + 600,
          votingClosedAndSentBlockNumber: 0,
          votingClosedAndSentTimestamp: 0,
          l1BlockHash:
            '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
          strategy: '0x72468fB2181da0E647885824feC0906F1aAb327B',
          sentToGovernance: false,
          createdBlock: 1,
          votedInfo: {
            support: false,
            votingPower: '0',
          },
          votingAssets: [
            appConfig.additional.aaveAddress,
            appConfig.additional.stkAAVEAddress,
          ],
          hasRequiredRoots: true,
        },
        votingMachineState: 1,
        payloads: [
          {
            creator: zeroAddress,
            id: 0,
            chainId: appConfig.govCoreChainId,
            maximumAccessLevelRequired: 1,
            state: 1,
            createdAt: dayjs().unix() - 1300,
            queuedAt: 0,
            executedAt: 0,
            cancelledAt: 0,
            expirationTime: 0,
            delay: 0,
            gracePeriod: 0,
            payloadsController:
              appConfig.payloadsControllerConfig[appConfig.govCoreChainId]
                .contractAddresses[0],
            actions: [],
          },
        ],
        title: 'Test proposal',
      },
      precisionDivider: '1000000000000000000',
      balances: [
        {
          blockHash:
            '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
          tokenName: getAssetName(appConfig.additional.aaveAddress),
          underlyingAsset: appConfig.additional.aaveAddress,
          value: '250',
          basicValue: '2500000000000000000000',
          isWithDelegatedPower: false,
          userBalance: '0',
        },
        {
          blockHash:
            '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
          tokenName: getAssetName(appConfig.additional.stkAAVEAddress),
          underlyingAsset: appConfig.additional.stkAAVEAddress,
          value: '50',
          basicValue: '500000000000000000000',
          isWithDelegatedPower: false,
          userBalance: '0',
        },
        {
          blockHash:
            '0x411a5298589b9cfac5848f43dff3cf06d894693d044447791dd25d3fcf16723e',
          tokenName: getAssetName(appConfig.additional.aAaveAddress),
          underlyingAsset: appConfig.additional.aAaveAddress,
          value: '0',
          basicValue: '0',
          isWithDelegatedPower: false,
          userBalance: '0',
        },
      ],
      config: {
        accessLevel: 1,
        votingDuration: 0,
        quorum: 200,
        differential: 50,
        coolDownBeforeVotingStart: 600,
        minPropositionPower: 5,
      },
      timings: {
        cooldownPeriod: 600,
        expirationTime: 2592000,
        executionDelay: 600,
      },
      combineState: 1,
    },
  } as ProposalWithLoadings;
}
