import { Box, useTheme } from '@mui/system';
import React from 'react';

import LinkIcon from '../../assets/icons/linkIcon.svg';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { Link } from '../Link';
import { CustomSkeleton } from '../primitives/CustomSkeleton';
import { IconBox } from '../primitives/IconBox';
import NoSSR from '../primitives/NoSSR';

interface DetailsLinksProps {
  proposalId: number;
  discussionLink?: string;
  snapshot?: string;
  prerender?: boolean;
}

export function DetailsLinks({
  proposalId,
  discussionLink,
  snapshot,
  prerender,
}: DetailsLinksProps) {
  const isRendered = useStore((store) => store.isRendered);
  const theme = useTheme();

  const links = [];
  if (snapshot) {
    links.unshift({
      title: texts.proposals.detailsLinkSnapshotVoting,
      link: snapshot,
    });
  }
  if (discussionLink) {
    links.unshift({
      title: texts.proposals.detailsLinkForumDiscussion,
      link: discussionLink,
    });
  }
  if (prerender) {
    links.unshift({
      title: texts.proposals.detailsLinkSeatbeltReport,
      link: `https://github.com/bgd-labs/seatbelt-gov-v3/blob/main/reports/proposals/${String(
        proposalId,
      )}.md`,
    });
  }

  if (!isRendered) {
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
