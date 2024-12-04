import { Box } from '@mui/system';
import React from 'react';
import { Address, Hex } from 'viem';

import { isEnsName } from '../../helpers/ensHelpers';
import { getScanLink } from '../../helpers/getScanLink';
import { texts } from '../../helpers/texts/texts';
import { useStore } from '../../providers/ZustandStoreProvider';
import { ENSDataExists } from '../../store/selectors/ensSelectors';
import { textCenterEllipsis } from '../../styles/textCenterEllipsis';
import { ENSProperty, RepresentationFormData } from '../../types';
import { ChainNameWithIcon } from '../ChainNameWithIcon';
import { CopyAndExternalIconsSet } from '../CopyAndExternalIconsSet';
import { Link } from '../Link';

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
  const ensData = useStore((store) => store.ensData);
  const activeWallet = useStore((store) => store.activeWallet);

  const activeAddress = activeWallet?.address || '';

  const formattedData: { representative: Address | string; chainId: number }[] =
    [];
  for (const item of formData) {
    const representative = item.representative;
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

        const link = getScanLink({ address: item.representative });

        return (
          <Box sx={{ display: 'inline' }} key={item.chainId}>
            {firstText} {isRepresent ? 'by' : ''}{' '}
            {isRepresent && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <Link
                  href={link}
                  css={{
                    color: '$textSecondary',
                    hover: { opacity: '0.7 !important' },
                  }}
                  inNewWindow>
                  {isEnsName(item.representative)
                    ? item.representative
                    : ENSDataExists(
                          ensData,
                          item.representative as Hex,
                          ENSProperty.NAME,
                        )
                      ? ensData[item.representative.toLocaleLowerCase() as Hex]
                          .name
                      : textCenterEllipsis(item.representative, 5, 5)}
                </Link>
                <CopyAndExternalIconsSet
                  iconSize={12}
                  externalLink={link}
                  sx={{ '.CopyAndExternalIconsSet__link': { ml: 3 } }}
                />
              </Box>
            )}{' '}
            for{' '}
            <b>
              <ChainNameWithIcon
                chainId={item.chainId}
                iconSize={10}
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
