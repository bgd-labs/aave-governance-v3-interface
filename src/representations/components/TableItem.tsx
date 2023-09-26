import { Box, useTheme } from '@mui/system';

import { useStore } from '../../store';
import { Divider } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { getChainName } from '../../ui/utils/getChainName';
import { RepresentationFormData } from '../store/representationsSlice';
import { getFormRepresentationsData } from '../utils/getFormRepresentationsData';
import { RepresentationsTableItemField } from './RepresentationsTableItemField';

export interface TableItemProps {
  representativeAddress?: string;
  chainId?: number;
  loading?: boolean;
  isEdit?: boolean;
  isViewChanges?: boolean;
  formData?: RepresentationFormData[];
  inputName?: string;
}

export function TableItem({
  representativeAddress,
  chainId,
  loading,
  formData,
  isEdit,
  isViewChanges,
  inputName,
}: TableItemProps) {
  const theme = useTheme();
  const { representationDataLoading } = useStore();
  const formRepresentativeAddress = getFormRepresentationsData({
    chainId: chainId || 0,
    representativeAddress,
    formData,
  });

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          [theme.breakpoints.up('sm')]: {
            height: 85,
          },
          [theme.breakpoints.up('md')]: {
            height: 110,
          },
          [theme.breakpoints.up('lg')]: {
            height: 115,
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
            maxWidth: 300,
            minWidth: 300,
          }}>
          {!chainId ? (
            <Box sx={{ mr: 20 }}>
              <CustomSkeleton circle width={35} height={35} />
            </Box>
          ) : (
            <NetworkIcon
              chainId={chainId}
              css={{ mr: 12, width: 35, height: 35 }}
            />
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            {!chainId ? (
              <Box sx={{ mb: 4 }}>
                <CustomSkeleton width={30} height={20} />
              </Box>
            ) : (
              <Box component="h2" sx={{ typography: 'h2' }}>
                {getChainName(chainId)}
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{ display: 'flex', flex: 2, justifyContent: 'flex-end', pr: 7 }}>
          {loading || representationDataLoading ? (
            <CustomSkeleton width={150} height={20} />
          ) : (
            <RepresentationsTableItemField
              isEdit={!!isEdit}
              isViewChanges={!!isViewChanges}
              inputName={`${inputName}.representative`}
              address={representativeAddress}
              addressTo={formRepresentativeAddress}
            />
          )}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
}
