import {
  RepresentationDataItem,
  RepresentativeAddress,
  RepresentedAddress,
} from '../store/representationsSlice';

export function getRepresentedAddresses(
  data: Record<number, RepresentationDataItem>,
) {
  const representedAddresses: RepresentedAddress[] = !!Object.keys(data).length
    ? Object.entries(data)
        .map((data) => {
          return data[1].represented.map((address) => {
            return {
              chainId: +data[0],
              address,
            };
          });
        })
        .flat()
    : [];

  return representedAddresses;
}

export function formatRepresentedAddresses(
  representedAddresses: RepresentedAddress[],
) {
  const addresses: RepresentativeAddress[] = [];
  const onlyUniqueAddresses: RepresentativeAddress[] = [];
  for (let i = 0; i < representedAddresses.length; i++) {
    const representedAddress: RepresentedAddress = representedAddresses[i];
    const optionsItem = addresses.find(
      (address) => address.address === representedAddress.address,
    );
    if (!!optionsItem?.address) {
      addresses.push({
        chainsIds: [...optionsItem.chainsIds, representedAddress.chainId],
        address: optionsItem.address,
      });
      const filteredOptions = addresses.filter(
        (option) => option.address === optionsItem.address,
      );
      const lastFilteredOption = filteredOptions[filteredOptions.length - 1];
      onlyUniqueAddresses.push(lastFilteredOption);
    } else {
      addresses.push({
        chainsIds: [representedAddress.chainId],
        address: representedAddress.address,
      });
    }
  }

  for (let i = 0; i < addresses.length; i++) {
    let found = false;
    for (let j = 0; j < onlyUniqueAddresses.length; j++) {
      if (addresses[i].address === onlyUniqueAddresses[j].address) {
        found = true;
        break;
      }
    }

    if (!found) {
      onlyUniqueAddresses.push(addresses[i]);
    }
  }

  const formattedAddresses: RepresentativeAddress[] = onlyUniqueAddresses.map(
    (option) => {
      const onlyUniqueChainsIds = option.chainsIds.filter(
        (value, index, self) => self.indexOf(value) === index,
      );

      return {
        chainsIds: onlyUniqueChainsIds,
        address: option.address,
      };
    },
  );

  return formattedAddresses;
}

export function getFormattedRepresentedAddresses(
  data: Record<number, RepresentationDataItem>,
) {
  const representedAddresses = getRepresentedAddresses(data);
  return formatRepresentedAddresses(representedAddresses);
}
