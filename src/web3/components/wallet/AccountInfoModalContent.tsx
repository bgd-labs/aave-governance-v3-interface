import { Box, useTheme } from '@mui/system';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';

import DelegationIcon from '/public/images/icons/delegationIcon.svg';
import RepresentationIcon from '/public/images/representation/representationVotingPower.svg';

import { RepresentedAddress } from '../../../representations/store/representationsSlice';
import { TransactionInfoItem } from '../../../transactions/components/TransactionInfoItem';
import {
  AllTransactions,
  TxType,
} from '../../../transactions/store/transactionsSlice';
import { Divider, Image, Link } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { IconBox } from '../../../ui/primitives/IconBox';
import { ROUTES } from '../../../ui/utils/routes';
import { textCenterEllipsis } from '../../../ui/utils/text-center-ellipsis';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { chainInfoHelper } from '../../../utils/configs';
import { CurrentPowers } from './CurrentPowers';
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
        mb: 14,
        [`@media only screen and (min-width: 470px)`]: {
          mb: 0,
          mr: 14,
        },
        [theme.breakpoints.up('md')]: {
          mr: 24,
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
        circle: {
          stroke: theme.palette.$textSecondary,
        },
        hover: {
          div: {
            p: {
              color: theme.palette.$text,
            },
          },
          path: {
            stroke: theme.palette.$text,
          },
          circle: {
            stroke: theme.palette.$text,
          },
        },
      }}>
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
        {iconType === 'delegate' ? <DelegationIcon /> : <RepresentationIcon />}
      </IconBox>

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
            whiteSpace: 'nowrap',
            typography: 'headline',
            cursor: 'pointer',
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

  const filteredTransactions = allTransactions.filter(
    (tx) => !!Object.keys(TxType).find((key) => key === tx.type)?.length,
  );
  // .filter((tx) => tx.type !== TxType.delegate);

  const visibleTxCount = forTest ? 1 : isRepresentedAvailable ? 3 : 4;

  return (
    <>
      <Box>
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
              <Box component="h2" sx={{ typography: 'h1' }}>
                {ensNameAbbreviated}
              </Box>

              <CopyAndExternalIconsSet
                iconSize={16}
                copyText={activeAddress}
                externalLink={`${chainInfoHelper.getChainParameters(chainId)
                  .blockExplorers?.default.url}/address/${activeAddress}`}
                sx={{ '.CopyAndExternalIconsSet__copy': { mx: 8 } }}
              />
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

      {isRepresentedAvailable && (
        <RepresentingForm
          representedAddresses={representedAddresses}
          isForTest={forTest}
          isTransactionsVisible={isActive && !!filteredTransactions.length}
        />
      )}

      {!forTest && <CurrentPowers />}

      {isActive && !!filteredTransactions.length && (
        <Box
          sx={{
            mt: 20,
            [theme.breakpoints.up('sm')]: {
              mt: 24,
            },
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              position: 'relative',
              pb: 38,
            }}>
            <Box
              component="h2"
              sx={{
                typography: 'h2',
                textAlign: 'left',
                width: '100%',
              }}>
              {filteredTransactions.length === 0
                ? texts.walletConnect.transactions
                : texts.walletConnect.lastTransaction(
                    filteredTransactions.length,
                  )}
            </Box>

            <Divider
              sx={{
                my: 14,
                borderBottomColor: theme.palette.$secondaryBorder,
                width: '100%',
              }}
            />

            <Box sx={{ width: '100%' }}>
              {filteredTransactions
                .slice(0, visibleTxCount)
                .map((tx, index) => (
                  <TransactionInfoItem key={index} tx={tx} />
                ))}
            </Box>

            {filteredTransactions.length > visibleTxCount && (
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
          </Box>
        </Box>
      )}
    </>
  );
}
