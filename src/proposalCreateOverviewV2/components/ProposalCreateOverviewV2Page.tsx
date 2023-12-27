'use client';

import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { zeroAddress } from 'viem';

import { ProposalListItemWrapper } from '../../proposals/components/proposalList/ProposalListItemWrapper';
import { useStore } from '../../store';
import { BackButton3D, Container, Link, SmallButton } from '../../ui';
import { CopyAndExternalIconsSet } from '../../ui/components/CopyAndExternalIconsSet';
import { TopPanelContainer } from '../../ui/components/TopPanelContainer';
import { ROUTES } from '../../ui/utils/routes';
import { appConfig } from '../../utils/appConfig';
import { chainInfoHelper } from '../../utils/configs';

export function ProposalCreateOverviewV2Page() {
  const router = useRouter();

  const { getProposalCreatedEventsData, proposalCreatedEventsData } =
    useStore();

  useEffect(() => {
    getProposalCreatedEventsData();
  }, []);

  return (
    <>
      <Container>
        <TopPanelContainer withoutContainer>
          <BackButton3D
            onClick={router.back}
            isVisibleOnMobile
            alwaysVisible
            alwaysWithBorders
          />
        </TopPanelContainer>

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
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                    <Box sx={{ typography: 'h1', mb: 12 }}>
                      Proposal Id: {item.proposalId}
                    </Box>

                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        mb: 24,
                      }}>
                      <Link
                        css={{
                          display: 'inline-block',
                          wordBreak: 'break-word',
                          hover: {
                            opacity: 0.7,
                          },
                        }}
                        href={`${chainInfoHelper.getChainParameters(
                          appConfig.govCoreChainId,
                        ).blockExplorers?.default.url}/address/${item.creator}`}
                        inNewWindow>
                        Creator: {item.creator}
                      </Link>

                      <CopyAndExternalIconsSet
                        sx={{ '.CopyAndExternalIconsSet__copy': { mx: 4 } }}
                        iconSize={12}
                        copyText={item.creator}
                        externalLink={`${chainInfoHelper.getChainParameters(
                          appConfig.govCoreChainId,
                        ).blockExplorers?.default.url}/address/${item.creator}`}
                      />
                    </Box>

                    <Box sx={{ display: 'inline-flex' }}>
                      <Link
                        href={`${ROUTES.proposalCreateOverview}/?ipfsHash=${
                          item.ipfsHash
                        }&votingPortal=${zeroAddress}${payloadsLinks.toString()}`}>
                        <SmallButton>View details</SmallButton>
                      </Link>
                    </Box>
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
