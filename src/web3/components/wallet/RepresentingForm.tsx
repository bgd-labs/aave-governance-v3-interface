import { Listbox } from '@headlessui/react';
import { Box, useTheme } from '@mui/system';
import React, { useState } from 'react';
import { Hex } from 'viem';
import { avalanche, mainnet, polygon } from 'viem/chains';

import ArrowToBottom from '/public/images/icons/arrowToBottom.svg';
import ArrowToTop from '/public/images/icons/arrowToTop.svg';
import LinkIcon from '/public/images/icons/linkIcon.svg';

import {
  RepresentativeAddress,
  RepresentedAddress,
} from '../../../representations/store/representationsSlice';
import { formatRepresentedAddresses } from '../../../representations/utils/getRepresentedAddresses';
import { useStore } from '../../../store';
import { Divider, Link } from '../../../ui';
import { IconBox } from '../../../ui/primitives/IconBox';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { chainInfoHelper } from '../../../utils/configs';
import { ENSDataExists } from '../../store/ensSelectors';
import { ENSProperty } from '../../store/ensSlice';
import { ChainsIcons } from './ChainsIcons';

interface RepresentingFormProps {
  representedAddresses: RepresentedAddress[];
  isForTest?: boolean;
}

const testInitialAddress = {
  chainsIds: [avalanche.id, mainnet.id, polygon.id],
  address: '0x2Ae626304D770eed47E5C80bF64E44A2352FF53b' as Hex,
};

export function RepresentingForm({
  representedAddresses,
  isForTest,
}: RepresentingFormProps) {
  const theme = useTheme();
  const store = useStore();
  const { setRepresentativeAddress, activeWallet, representative, ensData } =
    store;
  const [localAddress, setLocalAddress] = useState(
    isForTest ? testInitialAddress : representative,
  );

  if (!representedAddresses.length || (!activeWallet?.isActive && !isForTest))
    return null;

  const formattedOptions = formatRepresentedAddresses(representedAddresses);
  formattedOptions.unshift({
    chainsIds: appConfig.votingMachineChainIds,
    address: '0x0',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        mt: 30,
        mb: 30,
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
      }}>
      <Box
        component="h3"
        sx={{
          typography: 'h3',
          textAlign: 'center',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {texts.walletConnect.representing}
      </Box>

      <Divider sx={{ mt: 13, mb: 20, width: '100%' }} />

      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <Listbox
            value={localAddress}
            onChange={(value: RepresentativeAddress) => {
              setLocalAddress(value);
              if (!isForTest) {
                setRepresentativeAddress(value.address, value.chainsIds);
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
                    p: '7px 5px',
                    border: `1px solid ${theme.palette.$disabled}`,
                    borderColor: open ? '$main' : '$disabled',
                    color: '$text',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    [theme.breakpoints.up('sm')]: {
                      fontSize: 11,
                      lineHeight: '14px',
                    },
                    [theme.breakpoints.up('lg')]: {
                      p: '8px 10px',
                    },
                    '&:active, &:focus': {
                      borderColor: '$main',
                    },
                    hover: {
                      borderColor: theme.palette.$main,
                    },
                  }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      whiteSpace: 'nowrap',
                    }}>
                    {localAddress.address !== '0x0' && (
                      <Box sx={{ mr: 4 }}>
                        <ChainsIcons
                          chains={localAddress.chainsIds}
                          alwaysVisible
                        />
                      </Box>
                    )}
                    <Box>
                      {localAddress.address === '0x0'
                        ? texts.other.yourself
                        : ENSDataExists(
                            store,
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
                    {open ? <ArrowToTop /> : <ArrowToBottom />}
                  </IconBox>
                </Listbox.Button>
                <Listbox.Options
                  as={Box}
                  sx={{
                    position: 'absolute',
                    top: 'calc(100% - 1px)',
                    border: `1px solid ${theme.palette.$main}`,
                    width: !!localAddress.address
                      ? 'calc(100% - 17px)'
                      : '100%',
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
                        p: '7px 5px',
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
                            ? '$disabled'
                            : '$mainLight',
                        [theme.breakpoints.up('sm')]: {
                          fontSize: 11,
                          lineHeight: '14px',
                        },
                        [theme.breakpoints.up('lg')]: {
                          p: '8px 10px',
                        },
                        hover: {
                          backgroundColor: theme.palette.$disabled,
                        },
                      }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          whiteSpace: 'nowrap',
                        }}>
                        {option.address !== '0x0' && (
                          <Box sx={{ mr: 4 }}>
                            <ChainsIcons
                              chains={option.chainsIds}
                              alwaysVisible
                            />
                          </Box>
                        )}
                        <Box>
                          {option.address === '0x0'
                            ? texts.other.yourself
                            : ENSDataExists(
                                store,
                                option.address,
                                ENSProperty.NAME,
                              )
                            ? ensData[option.address.toLocaleLowerCase() as Hex]
                                .name
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
          <Link
            href={`${
              chainInfoHelper.getChainParameters(appConfig.govCoreChainId)
                .blockExplorers
            }address/${localAddress.address}`}
            css={{
              color: '$textSecondary',
              lineHeight: 1,
              hover: { color: theme.palette.$text },
            }}
            inNewWindow>
            <IconBox
              sx={{
                ml: 5,
                width: 12,
                height: 12,
                '> svg': {
                  width: 12,
                  height: 12,
                  path: { stroke: theme.palette.$textSecondary },
                  hover: {
                    color: theme.palette.$text,
                    path: { stroke: theme.palette.$text },
                  },
                },
              }}>
              <LinkIcon />
            </IconBox>
          </Link>
        )}
      </Box>
    </Box>
  );
}
