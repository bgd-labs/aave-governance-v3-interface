import { Box } from '@mui/system';
import React from 'react';

import { NewPayload } from '../../../proposalCreateOverview/store/proposalCreateOverviewSlice';
import { Link, SmallButton } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';

interface PayloadActionsProps {
  payload: NewPayload;
  forCreate?: boolean;
  withLink?: boolean;
  setIsSeatbeltModalOpen?: (value: boolean) => void;
  report?: string;
}

export function PayloadActions({
  payload,
  forCreate,
  withLink,
  setIsSeatbeltModalOpen,
  report,
}: PayloadActionsProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          color: '$textSecondary',
          a: {
            color: '$textSecondary',
          },
        }}>
        <Box sx={{ typography: 'descriptorAccent' }}>
          {texts.proposals.payloadsDetails.actions(
            payload.actionAddresses?.length || 0,
          )}
          :
        </Box>
        <Box
          component="ul"
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          {payload.actionAddresses?.map((address, index) => (
            <Box
              sx={{ display: 'inline-flex', alignItems: 'center', mb: 2 }}
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
                  component="li"
                  sx={{
                    typography: 'descriptor',
                    transition: 'all 0.2s ease',
                    hover: { opacity: 0.7 },
                  }}>
                  {textCenterEllipsis(address, 6, 6)}
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

      {withLink && !report && !forCreate ? (
        <Link
          href={`https://github.com/bgd-labs/seatbelt-gov-v3/blob/main/reports/payloads//${payload.chainId}/${payload.payloadsController}/${payload.id}.md`}
          inNewWindow
          css={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          <SmallButton
            onClick={(e) => {
              e.stopPropagation();
            }}>
            {texts.proposals.payloadsDetails.seatbelt}
          </SmallButton>
        </Link>
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
