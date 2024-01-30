import { Box, useTheme } from '@mui/system';
import React from 'react';

import LinkIcon from '/public/images/icons/linkIcon.svg';

import { useStore } from '../../../store';
import { Link, NoSSR } from '../../../ui';
import { CustomSkeleton } from '../../../ui/components/CustomSkeleton';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';

interface DetailsLinksProps {
  proposalId: number;
  discussionLink?: string;
  ipfsHash: string;
  prerender?: boolean;
}

export function DetailsLinks({
  proposalId,
  discussionLink,
  ipfsHash,
  prerender,
}: DetailsLinksProps) {
  const store = useStore();
  const theme = useTheme();

  const links = [
    // TODO: need think how to get correct snapshot link if it's real
    // {
    //   title: texts.proposals.detailsLinkSnapshotVoting,
    //   link: `https://snapshot.org/#/aave.eth/proposal/${ipfsHash}`,
    // },
  ];

  if (!!discussionLink) {
    links.unshift({
      title: texts.proposals.detailsLinkForumDiscussion,
      link: discussionLink,
    });
  }

  if (!!prerender) {
    links.unshift({
      title: texts.proposals.detailsLinkSeatbeltReport,
      link: `https://github.com/bgd-labs/seatbelt-gov-v3/blob/main/reports/proposals/${String(
        proposalId,
      )}.md`,
    });
  }

  if (!store.isRendered) {
    return (
      <Box
        sx={{
          display: 'flex',
          mb: 18,
          px: 18,
          [theme.breakpoints.up('sm')]: { px: 0, mb: 24 },
          '.react-loading-skeleton': { width: 70 },
          [theme.breakpoints.up('lg')]: {
            '.react-loading-skeleton': { width: 120 },
          },
        }}>
        <Box sx={{ mr: 12 }}>
          <CustomSkeleton height={20} />
        </Box>
        <Box sx={{ mr: 12 }}>
          <CustomSkeleton height={20} />
        </Box>
        <Box sx={{ mr: 12 }}>
          <CustomSkeleton height={20} />
        </Box>
      </Box>
    );
  }

  return (
    <NoSSR>
      <Box
        sx={{
          display: 'flex',
          mt: 24,
          px: 18,
          flexWrap: 'wrap',
          [theme.breakpoints.up('sm')]: { px: 0, mb: 24 },
        }}>
        {links.map((link, index) => (
          <Box
            sx={{
              width: '50%',
              mb: 12,
              [theme.breakpoints.up('sm')]: { width: 'auto', mb: 0 },
            }}
            key={index}>
            <Link
              href={link.link}
              inNewWindow
              css={{
                display: 'inline-flex',
                alignItems: 'center',
                mr: 16,
                color: '$textSecondary',
                path: { stroke: theme.palette.$textSecondary },
                hover: {
                  color: theme.palette.$text,
                  path: { stroke: theme.palette.$text },
                },
              }}>
              <IconBox
                sx={{
                  mr: 3,
                  width: 10,
                  height: 10,
                  '> svg': {
                    width: 10,
                    height: 10,
                    [theme.breakpoints.up('lg')]: {
                      width: 14,
                      height: 14,
                    },
                  },
                  [theme.breakpoints.up('lg')]: {
                    width: 14,
                    height: 14,
                  },
                }}>
                <LinkIcon />
              </IconBox>
              <Box component="p" sx={{ typography: 'body' }}>
                {link.title}
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </NoSSR>
  );
}
