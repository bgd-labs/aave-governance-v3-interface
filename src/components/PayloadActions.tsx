import { Box } from '@mui/system';
import React from 'react';

import { generateSeatbeltLink } from '../helpers/formatPayloadData';
import { getScanLink } from '../helpers/getScanLink';
import { texts } from '../helpers/texts/texts';
import { useStore } from '../providers/ZustandStoreProvider';
import { textCenterEllipsis } from '../styles/textCenterEllipsis';
import { PayloadWithHashes } from '../types';
import { CopyAndExternalIconsSet } from './CopyAndExternalIconsSet';
import { Link } from './Link';
import { SmallButton } from './SmallButton';

interface PayloadActionsProps {
  payload: PayloadWithHashes;
  forCreate?: boolean;
  withLink?: boolean;
  setIsSeatbeltModalOpen?: (value: boolean) => void;
  withoutTitle?: boolean;
  textColor?: string;
  showMoreClick?: () => void;
  withoutEllipsis?: boolean;
}

export function PayloadActions({
  payload,
  forCreate,
  withLink,
  setIsSeatbeltModalOpen,
  withoutTitle,
  textColor,
  showMoreClick,
  withoutEllipsis,
}: PayloadActionsProps) {
  const getSeatbeltReport = useStore((store) => store.getSeatbeltReport);
  const seatbeltReportsLoadings = useStore(
    (store) => store.seatbeltReportsLoadings,
  );

  const isWithShowMore = !!showMoreClick && payload.data.actions.length > 2;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          color: textColor || '$textSecondary',
          a: {
            color: textColor || '$textSecondary',
          },
        }}>
        {!withoutTitle && (
          <Box sx={{ typography: 'descriptorAccent' }}>
            {texts.proposals.payloadsDetails.actions(
              payload.data.actions?.length || 0,
            )}
            :
          </Box>
        )}

        <Box
          component="ul"
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          {(isWithShowMore
            ? payload.data.actions.slice(-2)
            : payload.data.actions
          )?.map((action, index) => (
            <Box
              sx={{ display: 'inline-flex', alignItems: 'center', mb: 4 }}
              key={index}>
              <Link
                css={{ display: 'inline-flex', alignItems: 'center' }}
                inNewWindow
                href={`${getScanLink({
                  chainId: Number(payload.chain),
                  address: action.target,
                })}${forCreate ? '#code' : ''}`}>
                <Box
                  className="PayloadActions__link"
                  component="li"
                  sx={{
                    typography: 'descriptor',
                    transition: 'all 0.2s ease',
                    wordBreak: 'break-word',
                    hover: { opacity: 0.7 },
                  }}>
                  {withoutEllipsis
                    ? action.target
                    : textCenterEllipsis(action.target, 6, 6)}
                </Box>
              </Link>

              <CopyAndExternalIconsSet
                iconSize={10}
                copyText={action.target}
                externalLink={`${getScanLink({
                  chainId: Number(payload.chain),
                  address: action.target,
                })}${forCreate ? '#code' : ''}`}
                sx={{ '.CopyAndExternalIconsSet__copy': { mx: 4 } }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {isWithShowMore && (
        <Box
          onClick={showMoreClick}
          sx={{
            color: '$textSecondary',
            cursor: 'pointer',
            typography: 'descriptorAccent',
            transition: 'all 0.2s ease',
            mt: 6,
            hover: { opacity: 0.7 },
          }}>
          {texts.proposals.votersListShowAll}
        </Box>
      )}

      {withLink && !payload.seatbeltMD && !setIsSeatbeltModalOpen ? (
        <Link
          href={generateSeatbeltLink(payload)}
          inNewWindow
          css={{
            display: 'flex',
            alignItems: 'center',
            mt: 4,
            outline: 'none !important',
          }}>
          <SmallButton
            onClick={(e) => {
              e.stopPropagation();
            }}>
            {texts.proposals.payloadsDetails.seatbelt}
          </SmallButton>
        </Link>
      ) : (
        withLink &&
        !!setIsSeatbeltModalOpen && (
          <Box sx={{ mt: 4 }}>
            <SmallButton
              loading={
                seatbeltReportsLoadings[
                  `${payload.proposalId}_${payload.payloadsController}_${payload.id}`
                ]
              }
              onClick={async (e) => {
                e.stopPropagation();
                if (!payload.seatbeltMD && !forCreate) {
                  await getSeatbeltReport({
                    proposalId: payload.proposalId ?? 0,
                    payload,
                  });
                }
                setIsSeatbeltModalOpen(true);
              }}>
              {texts.proposals.payloadsDetails.seatbelt}
            </SmallButton>
          </Box>
        )
      )}
    </>
  );
}
