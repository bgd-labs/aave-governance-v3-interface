import { Box } from '@mui/system';
import React from 'react';
import { Hex } from 'viem';

import { useStore } from '../../store';
import { ChainNameWithIcon } from '../../ui/components/ChainNameWithIcon';
import { textCenterEllipsis } from '../../ui/utils/text-center-ellipsis';
import { texts } from '../../ui/utils/texts';
import { ENSDataExists } from '../../web3/store/ensSelectors';
import { ENSProperty } from '../../web3/store/ensSlice';
import { isEnsName } from '../../web3/utils/ensHelpers';
import { RepresentationFormData } from '../store/representationsSlice';

interface TxTextProps {
  initialData: RepresentationFormData[];
  formData: RepresentationFormData[];
  isBeforeTx?: boolean;
  inTxHistory?: boolean;
}

export function TxText({
  initialData,
  formData,
  isBeforeTx,
  inTxHistory,
}: TxTextProps) {
  const store = useStore();
  const { activeWallet, ensData } = store;
  const activeAddress = activeWallet?.address || '';

  const formattedData: { representative: Hex | ''; chainId: number }[] = [];
  for (const item of formData) {
    let representative = item.representative;
    // get previous representative data for current chain id
    const initialRepresentativeItem: RepresentationFormData =
      initialData.filter((data) => data.chainId === item.chainId)[0];

    if (initialRepresentativeItem.representative !== representative) {
      formattedData.push(item);
    }
  }

  return (
    <>
      {formattedData.map((item, index) => {
        const isRepresent =
          item.representative !== undefined &&
          item.representative !== '' &&
          item.representative !== activeAddress;

        const firstText = isRepresent
          ? isBeforeTx
            ? texts.representationsPage.yourWillRepresent
            : texts.representationsPage.yourRepresented
          : isBeforeTx
            ? texts.representationsPage.yourCancelRepresented
            : texts.representationsPage.yourCanceledRepresented;
        const endText = formattedData.length - 1 !== index ? 'and ' : '';

        return (
          <Box sx={{ display: 'inline' }} key={item.chainId}>
            {firstText}{' '}
            {isRepresent &&
              `by ${
                isEnsName(item.representative)
                  ? item.representative
                  : ENSDataExists(
                        store,
                        item.representative as Hex,
                        ENSProperty.NAME,
                      )
                    ? ensData[item.representative.toLocaleLowerCase() as Hex]
                        .name
                    : textCenterEllipsis(item.representative, 5, 5)
              }`}{' '}
            for{' '}
            <b>
              <ChainNameWithIcon
                chainId={item.chainId}
                iconSize={8}
                css={{
                  position: 'relative',
                  bottom: inTxHistory ? 0 : 2,
                  display: inTxHistory ? 'inline-block' : 'inline-flex',
                  '.NetworkIcon': { mr: inTxHistory ? 'inline' : undefined },
                  '.ChainNameWithIcon__text': {
                    display: inTxHistory ? 'inline' : undefined,
                  },
                }}
              />
            </b>{' '}
            {endText}
          </Box>
        );
      })}
    </>
  );
}
