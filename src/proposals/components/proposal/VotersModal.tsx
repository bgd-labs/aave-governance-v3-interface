import { VotersData } from '@bgd-labs/aave-governance-ui-helpers';
import { Box, styled, useTheme } from '@mui/system';
import css from 'dom-css';
import React, { useRef } from 'react';
import Scrollbars, { positionValues } from 'react-custom-scrollbars-2';
import { zeroAddress } from 'viem';

import { useStore } from '../../../store';
import { BasicModal, Link } from '../../../ui';
import { FormattedNumber } from '../../../ui/components/FormattedNumber';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';
import { formatVoterAddress } from '../../utils/formatVoterAddress';
import { VoteBar } from '../VoteBar';

const BarWrapper = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: -50,
  paddingTop: 20,
  backgroundColor: theme.palette.$paper,
  zIndex: 2,
  marginBottom: 24,
  [theme.breakpoints.up('sm')]: { top: 0, paddingTop: 0 },
}));

const ListItem = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'inline-flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  color: theme.palette.$main,
  '&:last-of-type': {
    marginBottom: 0,
  },
}));

interface VotersModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  voters: VotersData[];
  title: string;
  forPercent: number;
  forVotes: number;
  againstPercent: number;
  againstVotes: number;
  requiredForVotes: number;
  requiredAgainstVotes: number;
  isFinished: boolean;
}

export function VotersModal({
  isOpen,
  setIsOpen,
  voters,
  title,
  forPercent,
  forVotes,
  againstPercent,
  againstVotes,
  requiredForVotes,
  requiredAgainstVotes,
  isFinished,
}: VotersModalProps) {
  const { activeWallet, representative } = useStore();
  const theme = useTheme();

  const votersFor = voters.filter((vote) => vote.support);
  const votersAgainst = voters.filter((vote) => !vote.support);

  const ListItemAddress = ({ vote }: { vote: VotersData }) => {
    const sm = useMediaQuery(media.sm);

    return (
      <Link
        inNewWindow
        css={{
          flex: 1,
          textAlign: 'left',
          transition: 'all 0.2s ease',
          hover: { opacity: '0.5' },
        }}
        href={`${chainInfoHelper.getChainParameters(appConfig.govCoreChainId)
          .blockExplorers?.default.url}/address/${vote.address}`}>
        <Box
          component="p"
          sx={{
            typography:
              vote.address.toLowerCase() ===
              (
                representative.address ||
                activeWallet?.address ||
                zeroAddress
              ).toLowerCase()
                ? 'headline'
                : 'body',
          }}>
          {formatVoterAddress(vote, sm)}
        </Box>
      </Link>
    );
  };

  const VotersTable = ({ type }: { type: 'for' | 'against' }) => {
    const isFor = type === 'for';
    const bottomShadowRef = useRef<HTMLDivElement>(Box as any);
    const handleUpdate = (values: positionValues) => {
      const { scrollTop, scrollHeight, clientHeight } = values;
      const bottomScrollTop = scrollHeight - clientHeight;
      const shadowTopOpacity =
        (1 / 20) *
        (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
      css(bottomShadowRef.current, { opacity: shadowTopOpacity });
    };

    return (
      <Box
        sx={{
          display: 'block',
          width: !(isFor ? votersAgainst : votersFor).length
            ? '70%'
            : 'calc(50% - 12px)',
          margin: !(isFor ? votersAgainst : votersFor).length
            ? '0 auto'
            : 'unset',
        }}>
        <Box sx={{ position: 'relative' }}>
          <Scrollbars
            style={{ width: '100%' }}
            onUpdate={handleUpdate}
            autoHeight
            universal
            autoHeightMin={100}
            autoHeightMax={370}>
            <Box sx={{ position: 'relative', pr: 16 }}>
              <BarWrapper>
                <VoteBar
                  type={type}
                  value={isFor ? forVotes : againstVotes}
                  requiredValue={
                    isFor ? requiredForVotes : requiredAgainstVotes
                  }
                  linePercent={isFor ? forPercent : againstPercent}
                  isFinished={isFinished}
                />
              </BarWrapper>

              <ListItem>
                <Box component="p" sx={{ typography: 'headline' }}>
                  {texts.proposals.voters} (
                  {(type === 'for' ? votersFor : votersAgainst).length})
                </Box>
                <Box component="p" sx={{ typography: 'headline' }}>
                  {texts.proposals.votersListVotingPower}
                </Box>
              </ListItem>
              {(type === 'for' ? votersFor : votersAgainst).map(
                (vote, index) => (
                  <ListItem key={index}>
                    <ListItemAddress vote={vote} />
                    <FormattedNumber
                      value={vote.votingPower}
                      visibleDecimals={3}
                    />
                  </ListItem>
                ),
              )}
            </Box>
          </Scrollbars>

          <Box
            ref={bottomShadowRef}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 10,
              background:
                'linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)',
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <BasicModal
      modalCss={{
        '.BasicModal__content--wrapper': { justifyContent: 'flex-start' },
      }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      withCloseButton
      withMinHeight
      maxWidth={690}>
      <Box sx={{ pt: 20 }}>
        <Box
          component="h2"
          sx={{
            typography: 'h1',
            mb: 34,
            textAlign:
              !votersFor.length || !votersAgainst.length ? 'center' : 'left',
          }}>
          {title}
        </Box>
        <Box>
          <Box sx={{ [theme.breakpoints.up('sm')]: { display: 'none' } }}>
            <BarWrapper>
              {!!votersFor.length && (
                <VoteBar
                  type="for"
                  value={forVotes}
                  requiredValue={requiredForVotes}
                  linePercent={forPercent}
                  isFinished={isFinished}
                />
              )}
              {!!votersAgainst.length && (
                <VoteBar
                  type="against"
                  value={againstVotes}
                  requiredValue={requiredAgainstVotes}
                  linePercent={againstPercent}
                  isFinished={isFinished}
                />
              )}
            </BarWrapper>

            {!!voters.length && (
              <>
                <ListItem>
                  <Box
                    component="p"
                    sx={{
                      flex: 1,
                      typography: 'headline',
                      display: 'inline-flex',
                      justifyContent: 'flex-start',
                    }}>
                    {texts.proposals.voters} ({voters.length})
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      flex: 1,
                      typography: 'headline',
                      display: 'inline-flex',
                      justifyContent: 'center',
                    }}>
                    {texts.proposals.votersListVotingPower}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      flex: 1,
                      typography: 'headline',
                      display: 'inline-flex',
                      justifyContent: 'flex-end',
                    }}>
                    {texts.other.voted}
                  </Box>
                </ListItem>

                {voters.map((vote) => (
                  <ListItem key={vote.transactionHash}>
                    <ListItemAddress vote={vote} />
                    <Box
                      sx={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <FormattedNumber
                        value={vote.votingPower}
                        visibleDecimals={3}
                        css={{ display: 'block' }}
                      />
                    </Box>

                    <Box
                      component="p"
                      sx={{
                        typography: 'headline',
                        textAlign: 'right',
                        flex: 1,
                        color: vote.support ? '$mainFor' : '$mainAgainst',
                      }}>
                      {vote.support
                        ? texts.other.toggleFor
                        : texts.other.toggleAgainst}
                    </Box>
                  </ListItem>
                ))}
              </>
            )}
          </Box>

          <Box
            sx={{
              display: 'none',
              [theme.breakpoints.up('sm')]: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              },
            }}>
            {!!votersFor.length && <VotersTable type="for" />}
            {!!votersAgainst.length && <VotersTable type="against" />}
          </Box>
        </Box>
      </Box>
    </BasicModal>
  );
}
