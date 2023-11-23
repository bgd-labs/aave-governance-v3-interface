import { Box, useTheme } from '@mui/system';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';

import CopyIcon from '/public/images/icons/copy.svg';
import DelegationIcon from '/public/images/icons/delegationIcon.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';
import RepresentationIcon from '/public/images/representation/representationVotingPower.svg';

import { RepresentedAddress } from '../../../representations/store/representationsSlice';
import { TransactionInfoItem } from '../../../transactions/components/TransactionInfoItem';
import { AllTransactions } from '../../../transactions/store/transactionsSlice';
import { CopyToClipboard, Divider, Image, Link } from '../../../ui';
import { IconBox } from '../../../ui/primitives/IconBox';
import { ROUTES } from '../../../ui/utils/routes';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { chainInfoHelper } from '../../../utils/configs';
import { RepresentingForm } from './RepresentingForm';

interface AccountInfoModalContentProps {
  activeAddress: string;
  chainId: number;
  isActive: boolean;
  allTransactions: AllTransactions;
  onAllTransactionButtonClick: () => void;
  onDisconnectButtonClick: () => void;
  onDelegateButtonClick: () => void;
  onRepresentationsButtonClick: () => void;
  ensName?: string;
  ensAvatar?: string;
  isAvatarExists?: boolean;
  forTest?: boolean;
  representedAddresses?: RepresentedAddress[];
}

type internalLink = {
  forTest?: boolean;
  onClick: () => void;
  route: string;
  title: string;
  iconType: 'delegate' | 'representation';
};

function InternalLink({
  onClick,
  route,
  forTest,
  title,
  iconType,
}: internalLink) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 12,
        [`@media only screen and (min-width: 470px)`]: {
          mb: 0,
          mr: forTest ? 6 : 18,
        },
        [theme.breakpoints.up('md')]: {
          mr: forTest ? 16 : 24,
        },
        div: {
          p: {
            color: theme.palette.$textSecondary,
          },
        },
        path: {
          transition: 'all 0.2s ease',
          stroke: theme.palette.$textSecondary,
        },
        hover: {
          div: {
            p: {
              color: theme.palette.$text,
            },
          },
          path: { stroke: theme.palette.$text },
        },
      }}>
      {!forTest && (
        <IconBox
          sx={{
            width: 16,
            height: 16,
            mr: 6,
            '> svg': {
              width: 16,
              height: 16,
            },
          }}>
          {iconType === 'delegate' ? (
            <DelegationIcon />
          ) : (
            <RepresentationIcon />
          )}
        </IconBox>
      )}

      {!forTest ? (
        <Link href={route} css={{ lineHeight: 1 }} onClick={onClick}>
          <Box component="p" sx={{ typography: 'headline' }}>
            {title}
          </Box>
        </Link>
      ) : (
        <Box
          component="p"
          sx={{
            typography: 'descriptorAccent',
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'all 0.2s ease',
          }}
          onClick={onClick}>
          {title}
        </Box>
      )}
    </Box>
  );
}

export function AccountInfoModalContent({
  activeAddress,
  chainId,
  isActive,
  allTransactions,
  onAllTransactionButtonClick,
  onDisconnectButtonClick,
  onDelegateButtonClick,
  onRepresentationsButtonClick,
  forTest,
  ensName,
  ensAvatar,
  isAvatarExists,
  representedAddresses,
}: AccountInfoModalContentProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const ensNameAbbreviated = ensName
    ? ensName.length > 30
      ? textCenterEllipsis(ensName, sm ? 10 : 6, sm ? 10 : 6)
      : ensName
    : undefined;

  const isRepresentedAvailable =
    typeof representedAddresses !== 'undefined' &&
    !!representedAddresses.length;

  return (
    <>
      <Box sx={{ mb: 24 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src={
                !isAvatarExists || forTest
                  ? makeBlockie(
                      activeAddress !== '' ? activeAddress : 'default',
                    )
                  : ensAvatar
              }
              alt=""
              sx={{ width: 34, height: 34, borderRadius: '50%' }}
            />

            <Box sx={{ display: 'flex', ml: 10, alignItems: 'center' }}>
              <Box component="h3" sx={{ typography: 'h3', fontWeight: '600' }}>
                {ensNameAbbreviated}
              </Box>

              <Box sx={{ mx: 8 }}>
                <CopyToClipboard copyText={activeAddress}>
                  <IconBox
                    sx={{
                      cursor: 'pointer',
                      width: 14,
                      height: 14,
                      '> svg': {
                        width: 14,
                        height: 14,
                      },
                      path: {
                        transition: 'all 0.2s ease',
                        stroke: theme.palette.$textSecondary,
                      },
                      hover: { path: { stroke: theme.palette.$main } },
                    }}>
                    <CopyIcon />
                  </IconBox>
                </CopyToClipboard>
              </Box>

              <Link
                href={`${chainInfoHelper.getChainParameters(chainId)
                  .blockExplorers?.default.url}/address/${activeAddress}`}
                css={{
                  color: '$textSecondary',
                  lineHeight: 1,
                  hover: { color: theme.palette.$text },
                }}
                inNewWindow>
                <IconBox
                  sx={{
                    cursor: 'pointer',
                    width: 16,
                    height: 16,
                    '> svg': {
                      width: 16,
                      height: 16,
                    },
                    path: {
                      transition: 'all 0.2s ease',
                      stroke: theme.palette.$textSecondary,
                    },
                    hover: { path: { stroke: theme.palette.$main } },
                  }}>
                  <LinkIcon />
                </IconBox>
              </Link>
            </Box>
          </Box>
        </Box>

        <Divider
          sx={{ my: 14, borderBottomColor: theme.palette.$secondaryBorder }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            [`@media only screen and (min-width: 470px)`]: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              [`@media only screen and (min-width: 470px)`]: {
                flexDirection: 'row',
              },
            }}>
            <InternalLink
              onClick={onDelegateButtonClick}
              route={ROUTES.delegate}
              forTest={forTest}
              title={texts.walletConnect.delegations}
              iconType="delegate"
            />

            <InternalLink
              onClick={onRepresentationsButtonClick}
              route={ROUTES.representations}
              forTest={forTest}
              title={texts.walletConnect.representations}
              iconType="representation"
            />
          </Box>

          <Box
            onClick={onDisconnectButtonClick}
            sx={{
              color: '$textSecondary',
              cursor: 'pointer',
              lineHeight: 1,
              transition: 'all 0.2s ease',
              hover: { color: theme.palette.$text },
            }}>
            <Box component="p">{texts.walletConnect.disconnect}</Box>
          </Box>
        </Box>
      </Box>

      {typeof representedAddresses !== 'undefined' && (
        <RepresentingForm
          representedAddresses={representedAddresses}
          isForTest={forTest}
        />
      )}

      {isActive ? (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              position: 'relative',
              pb: 35,
            }}>
            <Box
              component="h3"
              sx={{
                typography: 'h3',
                textAlign: 'left',
                fontWeight: 600,
                width: '100%',
              }}>
              {allTransactions.length === 0
                ? texts.walletConnect.transactions
                : texts.walletConnect.lastTransaction(allTransactions.length)}
            </Box>

            <Divider
              sx={{
                my: 14,
                borderBottomColor: theme.palette.$secondaryBorder,
                width: '100%',
              }}
            />

            {!!allTransactions.length ? (
              <>
                <Box
                  sx={{
                    width: '100%',
                  }}>
                  {allTransactions
                    .filter((tx) => tx.type !== 'delegate')
                    .slice(0, isRepresentedAvailable ? 3 : 4)
                    .map((tx, index) => (
                      <TransactionInfoItem key={index} tx={tx} />
                    ))}
                </Box>

                {allTransactions.length > 4 && (
                  <Box
                    component="button"
                    sx={{
                      typography: 'body',
                      position: 'absolute',
                      bottom: 0,
                      transition: 'all 0.2s ease',
                      display: 'inline-block',
                      color: '$textSecondary',
                      lineHeight: 1,
                      hover: { color: theme.palette.$text },
                    }}
                    onClick={onAllTransactionButtonClick}>
                    {texts.walletConnect.allTransactions}
                  </Box>
                )}
              </>
            ) : (
              <Box
                component="p"
                sx={{
                  typography: 'body',
                  color: '$textSecondary',
                  textAlign: 'left',
                  width: '100%',
                }}>
                {texts.walletConnect.transactionsEmpty}
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Box
          component="p"
          sx={{
            mt: 30,
            typography: 'body',
            color: '$textSecondary',
            textAlign: 'center',
          }}>
          {texts.walletConnect.transactionsNoWallet}
        </Box>
      )}
    </>
  );
}
