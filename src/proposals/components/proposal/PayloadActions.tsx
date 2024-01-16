import { Box } from '@mui/system';
import React from 'react';
import { metis } from 'viem/chains';

import { NewPayload } from '../../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { Link, SmallButton } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';
import { seatbeltStartLink } from '../../utils/formatPayloadData';

interface PayloadActionsProps {
  payload: NewPayload;
  forCreate?: boolean;
  withLink?: boolean;
  setIsSeatbeltModalOpen?: (value: boolean) => void;
  report?: string;
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
  report,
  withoutTitle,
  textColor,
  showMoreClick,
  withoutEllipsis,
}: PayloadActionsProps) {
  const isWithShowMore = !!showMoreClick && payload.actionAddresses.length > 2;

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
              payload.actionAddresses?.length || 0,
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
            ? payload.actionAddresses.slice(-2)
            : payload.actionAddresses
          )?.map((address, index) => (
            <Box
              sx={{ display: 'inline-flex', alignItems: 'center', mb: 4 }}
              key={index}>
              <Link
                css={{ display: 'inline-flex', alignItems: 'center' }}
                inNewWindow
                href={`${chainInfoHelper.getChainParameters(
                  payload.chainId || appConfig.govCoreChainId,
                ).blockExplorers?.default.url}/address/${address}${
                  forCreate ? '#code' : ''
                }`}>
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
                    ? address
                    : textCenterEllipsis(address, 6, 6)}
                </Box>
              </Link>

              <CopyAndExternalIconsSet
                iconSize={10}
                copyText={address}
                externalLink={`${chainInfoHelper.getChainParameters(
                  payload.chainId || appConfig.govCoreChainId,
                ).blockExplorers?.default.url}/address/${address}${
                  forCreate ? '#code' : ''
                }`}
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

      {withLink && !report && !forCreate ? (
        <>
          {payload.chainId !== metis.id && (
            <Link
              href={`${seatbeltStartLink}${payload.chainId}/${payload.payloadsController}/${payload.id}.md`}
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
          )}
        </>
      ) : (
        withLink &&
        !!setIsSeatbeltModalOpen &&
        !!report &&
        forCreate && (
          <Box sx={{ mt: 4 }}>
            <SmallButton
              onClick={(e) => {
                e.stopPropagation();
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
