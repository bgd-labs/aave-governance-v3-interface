import {
  RepresentationDataItem,
  RepresentativeAddress,
  RepresentedAddress,
} from '../types';

export function getRepresentedAddresses(
  data: Record<number, RepresentationDataItem>,
) {
  const representedAddresses: RepresentedAddress[] = Object.keys(data).length
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
  const addressesWithMultipleChains: RepresentativeAddress[] = [];

  for (let i = 0; i < representedAddresses.length; i++) {
    const representedAddress: RepresentedAddress = representedAddresses[i];
    const optionsItem = addresses.find(
      (address) => address.address === representedAddress.address,
    );
    if (optionsItem?.address) {
      addresses.push({
        chainsIds: [...optionsItem.chainsIds, representedAddress.chainId],
        address: optionsItem.address,
      });
      const filteredOptions = addresses.filter(
        (option) => option.address === optionsItem.address,
      );
      const lastFilteredOption = filteredOptions[filteredOptions.length - 1];

      const multipleChainsAddress = addressesWithMultipleChains.find(
        (address) => address.address === lastFilteredOption.address,
      );
      if (multipleChainsAddress) {
        const multipleChainsAddressIndex = addressesWithMultipleChains.indexOf(
          multipleChainsAddress,
          0,
        );
        const multipleChainsAddressFinalChains = {
          chainsIds: [
            ...multipleChainsAddress.chainsIds,
            ...lastFilteredOption.chainsIds,
          ],
          address: multipleChainsAddress.address,
        };
        addressesWithMultipleChains.splice(multipleChainsAddressIndex, 1);
        addressesWithMultipleChains.push(multipleChainsAddressFinalChains);
      } else {
        addressesWithMultipleChains.push(lastFilteredOption);
      }
    } else {
      addresses.push({
        chainsIds: [representedAddress.chainId],
        address: representedAddress.address,
      });
    }
  }

  const onlyUniqueAddresses: RepresentativeAddress[] = [];
  // pushed addresses with multiple chains to onlyUniqueAddresses and checked whether onlyUniqueAddresses already had this address
  for (let i = 0; i < addressesWithMultipleChains.length; i++) {
    let found = false;
    for (let j = 0; j < onlyUniqueAddresses.length; j++) {
      if (
        addressesWithMultipleChains[i].address ===
        onlyUniqueAddresses[j].address
      ) {
        found = true;
        break;
      }
    }

    if (!found) {
      onlyUniqueAddresses.push(addressesWithMultipleChains[i]);
    }
  }
  // pushed addresses with only one chain to onlyUniqueAddresses and checked whether onlyUniqueAddresses already had this address
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

  // formatted chains to get only unique chains for every address
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
