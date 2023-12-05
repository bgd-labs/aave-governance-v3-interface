'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { zeroAddress } from 'viem';

import { ProposalListItemWrapper } from '../../proposals/components/proposalList/ProposalListItemWrapper';
import { useStore } from '../../store';
import { BackButton3D, Container, Link, SmallButton } from '../../ui';
import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';

export function ProposalCreateOverviewV2Page() {
  const router = useRouter();
  const theme = useTheme();

  const { getProposalCreatedEventsData, proposalCreatedEventsData } =
    useStore();

  useEffect(() => {
    getProposalCreatedEventsData();
  }, []);

  return (
    <>
      <Container>
        <Box>
          <Box
            sx={{ display: 'flex', [theme.breakpoints.up('sm')]: { mb: 12 } }}>
            <BackButton3D onClick={router.back} />
          </Box>
        </Box>

        <Box sx={{ mt: 24 }}>
          {!proposalCreatedEventsData.length ? (
            <p>Data requested, please wait a moment for the result</p>
          ) : (
            proposalCreatedEventsData.map((item) => {
              const payloadsLinks = Object.values(item.payloads).map(
                (payload, index) => {
                  return `&proposalId=${item.proposalId}&payload[${index}].chainId=${payload.chainId}&payload[${index}].accessLevel=${payload.accessLevel}&payload[${index}].payloadsController=${payload.payloadsController}&payload[${index}].payloadId=${payload.payloadId}&`;
                },
              );

              return (
                <ProposalListItemWrapper isForHelpModal key={item.proposalId}>
                  <Box>
                    <Box sx={{ typography: 'h1', mb: 12 }}>
                      Proposal Id: {item.proposalId}
                    </Box>

                    <Link
                      css={{ mb: 24, display: 'inline-block' }}
                      href={`${chainInfoHelper.getChainParameters(
                        appConfig.govCoreChainId,
                      ).blockExplorers?.default.url}/address/${item.creator}`}
                      inNewWindow>
                      Creator: {item.creator}
                    </Link>

                    <Link
                      href={`/proposal-create-overview/?ipfsHash=${
                        item.ipfsHash
                      }&votingPortal=${zeroAddress}${payloadsLinks.toString()}`}>
                      <SmallButton>View details</SmallButton>
                    </Link>
                  </Box>
                </ProposalListItemWrapper>
              );
            })
          )}
        </Box>
      </Container>
    </>
  );
}
