import { ProposalMetadata } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import React from 'react';

import { BoxWith3D, SmallButton } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { MarkdownContainer } from '../../../ui/components/MarkdownContainer';
import { texts } from '../../../ui/utils/texts';

interface DetailsProps {
  ipfs?: ProposalMetadata;
  ipfsError?: string;
  onClick?: () => void;
}

export function Details({ ipfs, ipfsError, onClick }: DetailsProps) {
  if (!ipfs && !ipfsError)
    return (
      <>
        <Box
          sx={(theme) => ({
            mb: 18,
            [theme.breakpoints.up('lg')]: {
              mb: 24,
            },
          })}>
          <Box sx={{ mb: 8 }}>
            <CustomSkeleton width={100} height={16} />
          </Box>
          <CustomSkeleton height={16} />
        </Box>

        <CustomSkeleton count={20} height={19} />
      </>
    );

  if (!ipfs && ipfsError)
    return (
      <Box>
        <BoxWith3D
          className="ProposalDetails__error"
          wrapperCss={{ my: 12 }}
          borderSize={10}
          contentColor="$mainAgainst"
          css={{ p: '14px 18px' }}>
          <Box
            component="p"
            sx={{
              typography: 'descriptor',
              color: '$light',
              textAlign: 'center',
            }}>
            {ipfsError}
          </Box>
        </BoxWith3D>

        {!!onClick && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              mt: 18,
            }}>
            <SmallButton onClick={onClick}>Re-request</SmallButton>
          </Box>
        )}
      </Box>
    );

  return (
    <>
      <Box
        sx={(theme) => ({
          mb: 18,
          [theme.breakpoints.up('lg')]: {
            mb: 24,
          },
        })}>
        <Box component="p" sx={{ typography: 'h2', mb: 12 }}>
          {texts.proposals.author}
        </Box>
        <Box component="p">{ipfs?.author}</Box>
      </Box>

      <MarkdownContainer
        markdown={ipfs?.description || ''}
        replaceImgSrc="https://raw.githubusercontent.com/aave/aip/main/content/"
      />
    </>
  );
}
