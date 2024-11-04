import { Listbox } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react';
import { Hex } from 'viem';
import { avalanche, mainnet, polygon } from 'viem/chains';

import ArrowToBottom from '/public/images/icons/arrowToBottom.svg';
import ArrowToTop from '/public/images/icons/arrowToTop.svg';

import {
  RepresentativeAddress,
  RepresentedAddress,
} from '../../../representations/store/representationsSlice';
import { formatRepresentedAddresses } from '../../../representations/utils/getRepresentedAddresses';
import { useStore } from '../../../store/ZustandStoreProvider';
import { Divider } from '../../../ui';
import { CopyAndExternalIconsSet } from '../../../ui/components/CopyAndExternalIconsSet';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import { media } from '../../../ui/utils/themeMUI';
import { useMediaQuery } from '../../../ui/utils/useMediaQuery';
import { appConfig } from '../../../utils/appConfig';
import { getScanLink } from '../../../utils/getScanLink';
import { ENSDataExists } from '../../store/ensSelectors';
import { ENSProperty } from '../../store/ensSlice';
import { ChainsIcons } from '../ChainsIcons';

interface RepresentingFormProps {
  representedAddresses: RepresentedAddress[];
  isForTest?: boolean;
  isTransactionsVisible?: boolean;
}

const testInitialAddress = {
  chainsIds: [avalanche.id, mainnet.id, polygon.id],
  address: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b' as Hex,
};

export function RepresentingForm({
  representedAddresses,
  isForTest,
  isTransactionsVisible,
}: RepresentingFormProps) {
  const theme = useTheme();
  const sm = useMediaQuery(media.sm);

  const setRepresentativeAddress = useStore(
    (store) => store.setRepresentativeAddress,
  );
  const activeWallet = useStore((store) => store.activeWallet);
  const representative = useStore((store) => store.representative);
  const ensData = useStore((store) => store.ensData);

  const [localAddress, setLocalAddress] = useState(
    isForTest ? testInitialAddress : representative,
  );

  if (!representedAddresses.length || (!activeWallet?.isActive && !isForTest))
    return null;

  const formattedOptions = formatRepresentedAddresses(representedAddresses);
  formattedOptions.unshift({
    chainsIds: appConfig.votingMachineChainIds,
    address: '',
  });

  const isToTop = !isForTest && !isTransactionsVisible;

  return (
    <Box
      sx={{
        display: 'flex',
        mt: 20,
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 11,
        [theme.breakpoints.up('sm')]: {
          mt: 24,
        },
      }}>
      <Box
        component="h2"
        sx={{
          width: '100%',
          typography: 'h2',
          textAlign: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {texts.walletConnect.representing}
      </Box>

      <Divider
        sx={{
          my: 14,
          borderBottomColor: theme.palette.$secondaryBorder,
          width: '100%',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          alignSelf: 'flex-start',
        }}>
        <Box sx={{ width: '100%', maxWidth: 510, position: 'relative' }}>
          <Listbox
            value={localAddress}
            onChange={(value: RepresentativeAddress) => {
              setLocalAddress(value);
              if (!isForTest) {
                setRepresentativeAddress(value.address as Hex, value.chainsIds);
              }
            }}>
            {({ open }) => (
              <>
                <Listbox.Button
                  as={Box}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    fontWeight: '400',
                    fontSize: 10,
                    lineHeight: '12px',
                    p: '8px 5px',
                    border: `1px solid ${theme.palette.$main}`,
                    color: '$text',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    [theme.breakpoints.up('sm')]: {
                      typography: 'body',
                    },
                    [theme.breakpoints.up('lg')]: {
                      p: '6px 10px',
                    },
                    '&:active, &:focus': {
                      borderColor: '$main',
                    },
                    hover: {
                      backgroundColor: theme.palette.$light,
                    },
                  }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                    }}>
                    {localAddress.address !== '' && (
                      <Box sx={{ mr: 4 }}>
                        <ChainsIcons
                          chains={localAddress.chainsIds}
                          alwaysVisible
                        />
                      </Box>
                    )}
                    <Box>
                      {localAddress.address === ''
                        ? texts.other.yourself
                        : ENSDataExists(
                              ensData,
                              localAddress.address,
                              ENSProperty.NAME,
                            )
                          ? ensData[
                              localAddress.address.toLocaleLowerCase() as Hex
                            ].name
                          : localAddress.address}
                    </Box>
                  </Box>

                  <IconBox sx={{ path: { stroke: theme.palette.$main } }}>
                    {isToTop ? (
                      open ? (
                        <ArrowToBottom />
                      ) : (
                        <ArrowToTop />
                      )
                    ) : open ? (
                      <ArrowToTop />
                    ) : (
                      <ArrowToBottom />
                    )}
                  </IconBox>
                </Listbox.Button>
                <Listbox.Options
                  as={Box}
                  sx={{
                    position: 'absolute',
                    top: isToTop ? 'auto' : 'calc(100% - 1px)',
                    bottom: isToTop ? 'calc(100% - 1px)' : 'auto',
                    border: `1px solid ${theme.palette.$main}`,
                    width: '100%',
                    maxHeight: 250,
                    overflowY: 'auto',
                    zIndex: 2,
                    backgroundColor: '$mainLight',
                  }}>
                  {formattedOptions.map((option, index) => (
                    <Listbox.Option
                      as={Box}
                      key={index}
                      value={option}
                      disabled={
                        option.address.toLowerCase() ===
                        localAddress.address.toLowerCase()
                      }
                      sx={{
                        width: '100%',
                        fontWeight: '400',
                        fontSize: 10,
                        lineHeight: '12px',
                        p: '8px 5px',
                        color: '$text',
                        transition: 'all 0.2s ease',
                        cursor:
                          option.address.toLowerCase() ===
                          localAddress.address.toLowerCase()
                            ? 'default'
                            : 'pointer',
                        backgroundColor:
                          option.address.toLowerCase() ===
                          localAddress.address.toLowerCase()
                            ? '$light'
                            : '$mainLight',
                        [theme.breakpoints.up('sm')]: {
                          typography: 'body',
                        },
                        [theme.breakpoints.up('lg')]: {
                          p: '6px 10px',
                        },
                        hover: {
                          backgroundColor: theme.palette.$light,
                        },
                      }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          whiteSpace: 'nowrap',
                        }}>
                        {option.address !== '' && (
                          <Box sx={{ mr: 4 }}>
                            <ChainsIcons
                              chains={option.chainsIds}
                              alwaysVisible
                            />
                          </Box>
                        )}
                        <Box>
                          {option.address === ''
                            ? texts.other.yourself
                            : ENSDataExists(
                                  ensData,
                                  option.address,
                                  ENSProperty.NAME,
                                )
                              ? ensData[
                                  option.address.toLocaleLowerCase() as Hex
                                ].name
                              : option.address}
                        </Box>
                      </Box>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </>
            )}
          </Listbox>
        </Box>

        {!!localAddress.address && (
          <CopyAndExternalIconsSet
            iconSize={16}
            copyText={sm ? localAddress.address : undefined}
            externalLink={getScanLink({
              chainId: localAddress.chainsIds[0],
              address: localAddress.address,
            })}
            sx={{
              '.CopyAndExternalIconsSet__copy, .CopyAndExternalIconsSet__link':
                { ml: 8 },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
