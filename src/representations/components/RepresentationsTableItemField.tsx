import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Field } from 'react-final-form';
import { Address, isAddress, zeroAddress } from 'viem';

import { useStore } from '../../store';
import { InputWithAnimation } from '../../ui/components/InputWithAnimation';
import { InputWrapper } from '../../ui/components/InputWrapper';
import { TableText } from '../../ui/components/TableText';
import {
  composeValidators,
  ensNameOrAddressValidator,
} from '../../ui/utils/inputValidation';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { checkIfAddressENS } from '../../web3/store/ensSelectors';
import { isEnsName } from '../../web3/utils/ensHelpers';

const Text = ({
  address,
  isCrossed,
  alwaysGray,
  isError,
  ensName,
  forHelp,
}: {
  address?: string;
  isCrossed?: boolean;
  alwaysGray?: boolean;
  isError?: boolean;
  ensName?: string;
  forHelp?: boolean;
}) => {
  const ens = ensName || '';

  return (
    <TableText
      topText={texts.representationsPage.notRepresented}
      isCrossed={isCrossed}
      alwaysGray={alwaysGray}
      isError={isError}
      errorMessage={texts.other.userNotFound}
      value={address}
      withoutHover={forHelp}
      isErrorOnRight>
      <>
        {!!address
          ? texts.representationsPage.represented
          : texts.representationsPage.notRepresented}
        {!!address && (
          <Box
            component="p"
            sx={{
              typography: 'h2',
              ml: 4,
            }}>
            by{' '}
            {isEnsName(ens)
              ? ens.length > 15
                ? textCenterEllipsis(ens, 9, 6)
                : ens
              : textCenterEllipsis(address, 5, 4)}
          </Box>
        )}
      </>
    </TableText>
  );
};

interface RepresentationsTableItemFieldProps {
  isEdit: boolean;
  isViewChanges: boolean;
  inputName: string;
  address?: string;
  addressTo?: string;
  forHelp?: boolean;
}

export function RepresentationsTableItemField({
  isEdit,
  isViewChanges,
  inputName,
  address,
  addressTo,
  forHelp,
}: RepresentationsTableItemFieldProps) {
  const activeWallet = useStore((store) => store.activeWallet);
  const fetchEnsNameByAddress = useStore(
    (store) => store.fetchEnsNameByAddress,
  );
  const fetchAddressByEnsName = useStore(
    (store) => store.fetchAddressByEnsName,
  );
  const ensData = useStore((store) => store.ensData);
  const addIncorrectRepresentationField = useStore(
    (store) => store.addIncorrectRepresentationField,
  );
  const removeIncorrectRepresentationField = useStore(
    (store) => store.removeIncorrectRepresentationField,
  );
  const clearIncorrectRepresentationFields = useStore(
    (store) => store.clearIncorrectRepresentationFields,
  );

  const [shownAddress, setShownAddress] = React.useState<string | undefined>(
    address,
  );
  const [shownAddressTo, setShownAddressTo] = React.useState<
    string | undefined
  >(addressTo);

  // shown address on hover if inputed EnsName
  const [addressToFromEns, setAddressToFromEns] = React.useState<
    string | undefined
  >(addressTo);

  const [isEnsToIncorrect, setIsEnsToIncorrect] = React.useState(false);

  useEffect(() => {
    if (!address) {
      setShownAddress(undefined);
    }
    if (address) {
      if (isAddress(address)) {
        fetchEnsNameByAddress(address).then(() => {
          const addressData = ensData[address.toLowerCase() as Address];

          setShownAddress(
            addressData && addressData.name
              ? ensData[address.toLowerCase() as Address].name
              : address,
          );
        });
      }
    }
  }, [ensData, address]);

  useEffect(() => {
    if (!addressTo) {
      setShownAddressTo(undefined);
    }
    if (addressTo && !forHelp) {
      if (isAddress(addressTo)) {
        fetchEnsNameByAddress(addressTo).then(() => {
          const addressData = ensData[addressTo.toLocaleLowerCase() as Address];
          setShownAddressTo(
            addressData && addressData.name
              ? ensData[addressTo.toLocaleLowerCase() as Address].name
              : addressTo,
          );
        });
      }
      if (isEnsName(addressTo)) {
        fetchAddressByEnsName(addressTo).then((foundAddress) => {
          if (!foundAddress) {
            setIsEnsToIncorrect(true);
            addIncorrectRepresentationField(inputName);
          } else {
            setIsEnsToIncorrect(false);
            removeIncorrectRepresentationField(inputName);
            setAddressToFromEns(foundAddress);
          }
        });
      }
    }
  }, [ensData, addressTo, forHelp]);

  // clean on unmount
  useEffect(() => {
    return () => {
      clearIncorrectRepresentationFields();
    };
  }, []);

  const isAddressToVisible =
    checkIfAddressENS(
      ensData,
      activeWallet?.address || zeroAddress,
      address,
    ).toLowerCase() !==
    checkIfAddressENS(
      ensData,
      activeWallet?.address || zeroAddress,
      addressTo,
    ).toLowerCase();

  return (
    <>
      {!isEdit && !isViewChanges && (
        <Text forHelp={forHelp} address={address} ensName={shownAddress} />
      )}
      {isEdit && !isViewChanges && (
        <Field
          name={inputName}
          validate={composeValidators(ensNameOrAddressValidator)}>
          {(props) => (
            <InputWrapper
              onCrossClick={
                props.input.value !== ''
                  ? () => {
                      props.input.onChange('');
                    }
                  : undefined
              }
              isError={props.meta.error && props.meta.touched}
              error={props.meta.error}>
              <InputWithAnimation
                type="text"
                animatedPlaceholder={texts.representationsPage.notRepresented}
                {...props.input}
              />
            </InputWrapper>
          )}
        </Field>
      )}
      {!isEdit && isViewChanges && (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            [theme.breakpoints.up('sm')]: {
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: '100%',
            },
            [theme.breakpoints.up('md')]: {
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'unset',
              width: 'auto',
            },
          })}>
          <Text
            forHelp={forHelp}
            address={address}
            isCrossed={isAddressToVisible}
            alwaysGray
            ensName={shownAddress}
          />
          {isAddressToVisible && (
            <Text
              forHelp={forHelp}
              address={
                addressToFromEns?.toLowerCase() ===
                activeWallet?.address.toLowerCase()
                  ? ''
                  : addressToFromEns
              }
              ensName={shownAddressTo}
              isError={isEnsToIncorrect}
            />
          )}
        </Box>
      )}
    </>
  );
}
