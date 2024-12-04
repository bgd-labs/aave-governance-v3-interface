import {
  selectAllTransactionsByWallet,
  selectPendingTransactionByWallet,
  TransactionStatus,
} from '@bgd-labs/frontend-web3-utils';
import { Box, useTheme } from '@mui/system';
import dayjs from 'dayjs';
import makeBlockie from 'ethereum-blockies-base64';
import React, { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';

import SuccessIcon from '../../../assets/icons/check.svg';
import ErrorIcon from '../../../assets/icons/cross.svg';
import { appConfig } from '../../../configs/appConfig';
import { getLocalStorageLastConnectedWallet } from '../../../configs/localStorage';
import { texts } from '../../../helpers/texts/texts';
import { useStore } from '../../../providers/ZustandStoreProvider';
import { textCenterEllipsis } from '../../../styles/textCenterEllipsis';
import { media } from '../../../styles/themeMUI';
import { useMediaQuery } from '../../../styles/useMediaQuery';
import { RepresentativeAddress } from '../../../types';
import { ChainNameWithIcon } from '../../ChainNameWithIcon';
import { CustomSkeleton } from '../../primitives/CustomSkeleton';
import { IconBox } from '../../primitives/IconBox';
import { Image } from '../../primitives/Image';
import { RepresentingButton } from '../../Representations/RepresentingButton';
import { Spinner } from '../../Spinner';

interface ConnectWalletButtonProps {
  onClick: () => void;
  ensName?: string;
  ensAvatar?: string;
  isAvatarExists?: boolean;
  representative?: RepresentativeAddress;
}

export function ConnectWalletButton({
  onClick,
  ensName,
  ensAvatar,
  isAvatarExists,
  representative,
}: ConnectWalletButtonProps) {
  const walletActivating = useStore((store) => store.walletActivating);
  const walletConnectedTimeLock = useStore(
    (store) => store.walletConnectedTimeLock,
  );
  const activeWallet = useStore((store) => store.activeWallet);

  const theme = useTheme();
  const lg = useMediaQuery(media.lg);

  const isActive = activeWallet?.isActive;
  const activeAddress = activeWallet?.address || '';

  const allTxsFromStore = useStore((store) =>
    selectAllTransactionsByWallet(
      store.transactionsPool,
      activeAddress || zeroAddress,
    ),
  );
  const pendingTxsFromStore = useStore((store) =>
    selectPendingTransactionByWallet(
      store.transactionsPool,
      activeAddress || zeroAddress,
    ),
  );

  const [loading, setLoading] = useState(true);

  const allTransactions = activeAddress ? allTxsFromStore : [];
  const lastTransaction = allTransactions[allTransactions.length - 1];

  const ensNameAbbreviated = ensName
    ? ensName.length > 11
      ? textCenterEllipsis(ensName, 5, 3)
      : ensName
    : undefined;

  const [lastTransactionSuccess, setLastTransactionSuccess] = useState(false);
  const [lastTransactionError, setLastTransactionError] = useState(false);

  useEffect(() => {
    if (lastTransaction?.status && activeWallet && !walletConnectedTimeLock) {
      if (lastTransaction.status === TransactionStatus.Success) {
        setLastTransactionSuccess(true);
        setTimeout(() => setLastTransactionSuccess(false), 1000);
      } else if (lastTransaction.status === TransactionStatus.Reverted) {
        setLastTransactionError(true);
        setTimeout(() => setLastTransactionError(false), 1000);
      }
    }
  }, [lastTransaction]);

  const lastConnectedWallet = getLocalStorageLastConnectedWallet();

  useEffect(() => {
    if (!!lastConnectedWallet || !activeWallet) {
      setLoading(false);
    }
  }, [lastConnectedWallet]);

  // get all pending tx's from connected wallet
  const allPendingTransactions = activeAddress ? pendingTxsFromStore : [];
  // filtered pending tx's, if now > tx.timestamp + 30 min, than remove tx from pending array to not show loading spinner in connect wallet button
  const filteredPendingTx = allPendingTransactions.filter(
    (tx) => dayjs().unix() <= dayjs.unix(tx.localTimestamp).unix() + 1800,
  );

  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              '.react-loading-skeleton': { width: 120, height: 27 },
              [theme.breakpoints.up('lg')]: {
                '.react-loading-skeleton': { width: 140, height: 31 },
              },
            }}>
            <CustomSkeleton />
          </Box>
        </>
      ) : (
        <>
          {!isActive ? (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                width: 120,
                height: 28,
                backgroundColor: '$light',
                transition: 'all 0.2s ease',
                color: '$text',
                hover: {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.$mainButton
                      : theme.palette.$middleLight,
                },
                '&:active': {
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '$disabled' : '$secondary',
                },
                '&:disabled': {
                  cursor: 'not-allowed',
                  backgroundColor: '$light',
                  color: '$text',
                },
                [theme.breakpoints.up('lg')]: {
                  width: 140,
                  height: 32,
                },
              }}
              component="button"
              type="button"
              disabled={walletActivating}
              onClick={onClick}>
              <Box
                component="p"
                sx={{
                  typography: 'buttonSmall',
                }}>
                {walletActivating
                  ? texts.walletConnect.connectButtonConnecting
                  : texts.walletConnect.connectButtonConnect}
              </Box>
              {walletActivating && (
                <Box
                  sx={{
                    backgroundColor: '$light',
                    ml: 5,
                    position: 'relative',
                    top: 0.5,
                  }}>
                  <Spinner
                    size={16}
                    loaderLineColor="$light"
                    loaderCss={{ backgroundColor: '$text' }}
                    lineSize={2}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ChainNameWithIcon
                css={{
                  alignItems: 'center',
                  display: 'flex',
                  mr: 12,
                  '.ChainNameWithIcon__text': {
                    display: 'none',
                    [theme.breakpoints.up('sm')]: {
                      display: 'block !important',
                      typography: 'buttonSmall',
                    },
                  },
                  '.NetworkIcon': {
                    mr: 0,
                    [theme.breakpoints.up('sm')]: {
                      mr: 5,
                    },
                  },
                  [theme.breakpoints.up('lg')]: {
                    mr: 18,
                  },
                }}
                textCss={{ typography: 'buttonSmall', color: '$textLight' }}
                iconSize={16}
                chainId={activeWallet?.chain?.id || appConfig.govCoreChainId}
              />

              <Box
                component="button"
                type="button"
                onClick={onClick}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 8,
                  cursor: 'pointer',
                  minWidth: 120,
                  height: 28,
                  backgroundColor: lastTransactionError
                    ? '$error'
                    : lastTransactionSuccess
                      ? '$mainFor'
                      : '$light',
                  transition: 'all 0.2s ease',
                  color: '$text',
                  hover: {
                    backgroundColor: lastTransactionError
                      ? theme.palette.$error
                      : lastTransactionSuccess
                        ? theme.palette.$mainFor
                        : theme.palette.mode === 'dark'
                          ? theme.palette.$mainButton
                          : theme.palette.$middleLight,
                    '.ConnectWalletButton__text': {
                      color:
                        !lastTransactionError && !lastTransactionSuccess
                          ? theme.palette.$text
                          : theme.palette.$textWhite,
                    },
                  },
                  '&:active': {
                    backgroundColor: lastTransactionError
                      ? '$error'
                      : lastTransactionSuccess
                        ? '$mainFor'
                        : theme.palette.mode === 'dark'
                          ? '$disabled'
                          : '$secondary',
                  },
                  '&:disabled': {
                    cursor: 'not-allowed',
                    backgroundColor: '$light',
                    color: '$text',
                  },
                  [theme.breakpoints.up('lg')]: {
                    minWidth: 140,
                    height: 32,
                  },
                }}>
                {lastTransactionError && (
                  <IconBox
                    sx={{
                      position: 'relative',
                      zIndex: 5,
                      width: 13,
                      height: 13,
                      '> svg': {
                        width: 13,
                        height: 13,
                      },
                      mr: 5,
                      path: { stroke: theme.palette.$textWhite },
                    }}>
                    <ErrorIcon />
                  </IconBox>
                )}
                {lastTransactionSuccess && (
                  <IconBox
                    sx={{
                      position: 'relative',
                      zIndex: 5,
                      width: 15,
                      height: 15,
                      '> svg': {
                        width: 15,
                        height: 15,
                      },
                      mr: 5,
                      path: { stroke: theme.palette.$textWhite },
                    }}>
                    <SuccessIcon />
                  </IconBox>
                )}

                <Box
                  className="ConnectWalletButton__text"
                  sx={{
                    typography: 'buttonSmall',
                    flex: 1,
                    alignSelf: 'center',
                    color: lastTransactionError
                      ? '$textWhite'
                      : lastTransactionSuccess
                        ? '$textWhite'
                        : '$text',
                  }}>
                  {lastTransactionError
                    ? 'Error'
                    : lastTransactionSuccess
                      ? 'Success'
                      : ensNameAbbreviated
                        ? ensNameAbbreviated
                        : textCenterEllipsis(activeAddress, 4, 4)}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 22,
                    width: 22,
                    background: 'inherit',
                    backgroundImage: 'inherit',
                    borderRadius: '50%',
                    [theme.breakpoints.up('lg')]: {
                      height: 26,
                      width: 26,
                    },
                  }}>
                  {!!filteredPendingTx.length && (
                    <Spinner
                      size={lg ? 26 : 22}
                      loaderLineColor="$light"
                      loaderCss={{ backgroundColor: '$text' }}
                      css={{ position: 'absolute' }}
                    />
                  )}
                  <Image
                    src={
                      !isAvatarExists
                        ? makeBlockie(
                            activeAddress !== '' ? activeAddress : 'default',
                          )
                        : ensAvatar
                    }
                    alt=""
                    sx={{
                      height: 16,
                      width: 16,
                      borderRadius: '50%',
                      [theme.breakpoints.up('lg')]: {
                        height: 20,
                        width: 20,
                      },
                    }}
                  />
                </Box>
              </Box>

              {!!representative?.address && <RepresentingButton />}
            </Box>
          )}
        </>
      )}
    </>
  );
}
