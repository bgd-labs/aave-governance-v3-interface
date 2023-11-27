'use client';

import { Box, useTheme } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { zeroAddress } from 'viem';

import { useStore } from '../../store';
import { BackButton3D, Container, Divider, Link, SmallButton } from '../../ui';

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
          {proposalCreatedEventsData.map((item) => {
            const payloadsLinks = Object.values(item.payloads).map(
              (payload, index) => {
                return `&payload[${index}].chainId=${payload.chainId}&payload[${index}].accessLevel=${payload.accessLevel}&payload[${index}].payloadsController=${payload.payloadsController}&payload[${index}].payloadId=${payload.payloadId}&`;
              },
            );

            return (
              <Box key={item.proposalId}>
                <p>
                  Proposal id: <b>{item.proposalId}</b>
                </p>
                <br />
                <p>Creator: {item.creator}</p>
                <br />
                <p>Ipfs hash: {item.ipfsHash}</p>
                <br />

                <Box>
                  <Link
                    href={`/createByParams/?ipfsHash=${
                      item.ipfsHash
                    }&votingPortal=${zeroAddress}${payloadsLinks.toString()}`}>
                    <SmallButton>View</SmallButton>
                  </Link>
                </Box>

                <Divider sx={{ mb: 24, mt: 12 }} />
              </Box>
            );
          })}
        </Box>
      </Container>
    </>
  );
}
