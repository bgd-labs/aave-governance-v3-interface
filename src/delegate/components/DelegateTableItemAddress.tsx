import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Field } from 'react-final-form';
import { Hex, isAddress } from 'viem';

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
import { isEnsName } from '../../web3/utils/ensHelpers';

const Text = ({
  address,
  shownAddress,
  isCrossed,
  alwaysGray,
  isEnsName,
  isError,
  forHelp,
}: {
  address?: string;
  shownAddress?: string;
  isCrossed?: boolean;
  alwaysGray?: boolean;
  isEnsName?: boolean;
  isError?: boolean;
  forHelp?: boolean;
}) => {
  return (
    <TableText
      topText={texts.delegatePage.tableItemNotDelegated}
      value={address}
      isCrossed={isCrossed}
      alwaysGray={alwaysGray}
      errorMessage={texts.other.userNotFound}
      withoutHover={forHelp}
      isError={isError}>
      <>
        {!!shownAddress
          ? texts.delegatePage.tableItemDelegated
          : texts.delegatePage.tableItemNotDelegated}
        {!!shownAddress && (
          <Box
            component="p"
            sx={(theme) => ({
              typography: 'h3',
              ml: 4,
              position: 'relative',
              [theme.breakpoints.up('lg')]: { top: 1 },
            })}>
            to{' '}
            {isEnsName
              ? shownAddress.length > 20
                ? textCenterEllipsis(shownAddress, 14, 6)
                : shownAddress
              : textCenterEllipsis(shownAddress, 5, 4)}
          </Box>
        )}
      </>
    </TableText>
  );
};

interface DelegateTableItemAddressProps {
  isEdit: boolean;
  isViewChanges: boolean;
  inputName: string;
  address?: string;
  addressTo?: string;
  forHelp?: boolean;
}

export function DelegateTableItemAddress({
  isEdit,
  isViewChanges,
  inputName,
  address,
  addressTo,
  forHelp,
}: DelegateTableItemAddressProps) {
  const {
    fetchEnsNameByAddress,
    fetchAddressByEnsName,
    ensData,
    addDelegationIncorrectToField,
    removeDelegationIncorrectToField,
    clearDelegationIncorrectToFields,
  } = useStore();

  const [hoveredAddressTo, setHoveredAddressTo] = React.useState<
    string | undefined
  >(undefined);

  const [shownAddress, setShownAddress] = React.useState<string | undefined>(
    address,
  );
  const [shownAddressTo, setShownAddressTo] = React.useState<
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
          const addressData = ensData[address.toLocaleLowerCase() as Hex];
          setShownAddress(
            addressData && addressData.name
              ? ensData[address.toLocaleLowerCase() as Hex].name
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
          const addressData = ensData[addressTo.toLocaleLowerCase() as Hex];
          setShownAddressTo(
            addressData && addressData.name
              ? ensData[addressTo.toLocaleLowerCase() as Hex].name
              : addressTo,
          );
        });
      }
      if (isEnsName(addressTo)) {
        fetchAddressByEnsName(addressTo).then((foundAddress) => {
          if (!foundAddress) {
            setIsEnsToIncorrect(true);
            addDelegationIncorrectToField(inputName);
          } else {
            setHoveredAddressTo(foundAddress);
            setIsEnsToIncorrect(false);
            removeDelegationIncorrectToField(inputName);
          }
        });
      }
    }
  }, [ensData, addressTo]);

  // clean on unmount
  useEffect(() => {
    return () => clearDelegationIncorrectToFields();
  }, []);

  const isAddressToVisible = address !== addressTo;

  return (
    <>
      {!isEdit && !isViewChanges && (
        <Text
          forHelp={forHelp}
          address={address}
          shownAddress={shownAddress}
          isEnsName={isEnsName(shownAddress || '')}
        />
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
                animatedPlaceholder={texts.delegatePage.tableItemNotDelegated}
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
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            },
            [theme.breakpoints.up('md')]: {
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'unset',
              width: 'auto',
            },
          })}>
          <Text
            forHelp={forHelp}
            address={address}
            shownAddress={shownAddress}
            isCrossed={isAddressToVisible}
            alwaysGray
            isEnsName={isEnsName(shownAddress || '')}
          />
          {isAddressToVisible && (
            <Text
              forHelp={forHelp}
              address={
                isEnsName(addressTo || '') ? hoveredAddressTo : addressTo
              }
              shownAddress={shownAddressTo}
              isEnsName={isEnsName(shownAddressTo || '')}
              isError={isEnsToIncorrect}
            />
          )}
        </Box>
      )}
    </>
  );
}
