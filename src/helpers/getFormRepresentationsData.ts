import { RepresentationFormData } from '../types';

interface GetFormRepresentationsDataParams {
  chainId: number;
  representativeAddress?: string;
  formData?: RepresentationFormData[];
}

export function getFormRepresentationsData({
  chainId,
  representativeAddress,
  formData,
}: GetFormRepresentationsDataParams) {
  const formRepresentationsDataItem =
    !!formData &&
    !!formData.length &&
    formData.find((item) => item.chainId === chainId);

  return typeof formRepresentationsDataItem !== 'boolean' &&
    typeof formRepresentationsDataItem !== 'undefined'
    ? formRepresentationsDataItem.representative
    : representativeAddress;
}
