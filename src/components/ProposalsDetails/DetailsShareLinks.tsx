import { ProposalMetadata } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, styled } from '@mui/system';
import React from 'react';

import Download from '../../assets/icons/download.svg';
import Twitter from '../../assets/icons/twitterX.svg';
import { ipfsGateway } from '../../configs/configs';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { Link } from '../Link';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { IconBox } from '../primitives/IconBox';
import NoSSR from '../primitives/NoSSR';

const StyledLink = styled(Link)(({ theme }) => ({
  marginRight: 12,
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.palette.$textSecondary,
  '&:last-of-type': {
    mr: 0,
  },
}));

interface DetailsShareLinksProps {
  ipfs?: ProposalMetadata;
  ipfsError?: string;
  forCreate?: boolean;
}

export function DetailsShareLinks({
  ipfs,
  ipfsError,
  forCreate,
}: DetailsShareLinksProps) {
  const isRendered = useStore((store) => store.isRendered);

  if (!ipfs && !ipfsError)
    return (
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          '.react-loading-skeleton': { width: 70 },
          [theme.breakpoints.up('lg')]: {
            '.react-loading-skeleton': { width: 120 },
          },
        })}>
        <Box sx={{ mr: 12 }}>
          <CustomSkeleton height={20} />
        </Box>
        <CustomSkeleton height={20} />
      </Box>
    );

  if (!ipfs && ipfsError) return null;

  if (!isRendered) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <Box sx={{ mr: 12 }}>
            <CustomSkeleton width={70} height={20} />
          </Box>
          <CustomSkeleton width={70} height={20} />
        </Box>
      </>
    );
  }

  return (
    <NoSSR>
      {!forCreate && (
        <StyledLink
          sx={(theme) => ({
            path: {
              fill: theme.palette.$textSecondary,
              transition: 'all 0.2s ease',
            },
            '&:hover': {
              color: theme.palette.$text,
              path: {
                fill: theme.palette.$text,
              },
            },
          })}
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            ipfs?.title || '',
          )}&url=${
            typeof window !== 'undefined' &&
            encodeURIComponent(window.location.href)
          }`}
          inNewWindow>
          <IconBox
            sx={{
              width: 20,
              height: 20,
              mr: 4,
              '> svg': { width: 20, height: 20 },
            }}>
            <Twitter />
          </IconBox>
          {texts.proposals.detailsShareTwitter}
        </StyledLink>
      )}
      <StyledLink
        sx={(theme) => ({
          path: {
            fill: theme.palette.$textSecondary,
            stroke: theme.palette.$textSecondary,
            transition: 'all 0.2s ease',
          },
          '&:hover': {
            color: theme.palette.$text,
            path: {
              fill: theme.palette.$text,
              stroke: theme.palette.$text,
            },
          },
        })}
        href={`${ipfsGateway}/${ipfs?.ipfsHash}`}
        inNewWindow>
        <IconBox
          sx={{
            width: 18,
            height: 18,
            mr: 4,
            '> svg': { width: 18, height: 18 },
          }}>
          <Download />
        </IconBox>
        {texts.proposals.detailsRawIpfs}
      </StyledLink>
    </NoSSR>
  );
}
