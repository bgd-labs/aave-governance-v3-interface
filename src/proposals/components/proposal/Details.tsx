import { ProposalMetadata } from '@bgd-labs/aave-governance-ui-helpers';
import { Box } from '@mui/system';
import React from 'react';

import { BoxWith3D } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { MarkdownContainer } from '../../../ui/components/MarkdownContainer';
import { texts } from '../../../ui/utils/texts';

interface DetailsProps {
  ipfs?: ProposalMetadata;
  ipfsError?: string;
}

export function Details({ ipfs, ipfsError }: DetailsProps) {
  if (!ipfs && !ipfsError)
    return (
      <>
        <Box sx={{ mb: 16 }}>
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
      <BoxWith3D
        wrapperCss={{ my: 12 }}
        borderSize={10}
        contentColor="$mainAgainst"
        css={{ p: '15px 20px' }}>
        <Box
          component="p"
          sx={{
            color: '$light',
            fontSize: 12,
            lineHeight: '15px',
            textAlign: 'center',
          }}>
          {ipfsError}
        </Box>
      </BoxWith3D>
    );

  return (
    <>
      <Box sx={{ mb: 16 }}>
        <Box component="p" sx={{ typography: 'headline', mb: 12 }}>
          {texts.proposals.author}
        </Box>
        <Box component="p" sx={{ typography: 'body' }}>
          {ipfs?.author}
        </Box>
      </Box>

      <MarkdownContainer
        markdown={ipfs?.description || ''}
        replaceImgSrc="https://raw.githubusercontent.com/aave/aip/main/content/"
      />
    </>
  );
}
