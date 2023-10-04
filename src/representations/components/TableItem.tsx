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
  forHelp?: boolean;
}

export function TableItem({
  representativeAddress,
  chainId,
  loading,
  formData,
  isEdit,
  isViewChanges,
  inputName,
  forHelp,
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
          flexDirection: 'column',
          py: 20,
          [theme.breakpoints.up('xsm')]: {
            flexDirection: isEdit ? 'column' : 'row',
            alignItems: isEdit ? 'flex-start' : 'center',
          },
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 85,
            py: 0,
          },
          [theme.breakpoints.up('md')]: {
            height: forHelp ? 85 : 110,
          },
          [theme.breakpoints.up('lg')]: {
            height: forHelp ? 90 : 115,
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flex: 1,
            maxWidth: 250,
            [theme.breakpoints.up('sm')]: {
              minWidth: 250,
            },
            [theme.breakpoints.up('md')]: {
              maxWidth: 300,
              minWidth: 300,
            },
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
          sx={{
            display: 'flex',
            flex: 2,
            justifyContent: 'flex-end',
            width: '100%',
            mt: 12,
            [theme.breakpoints.up('xsm')]: {
              mt: isEdit ? 12 : 0,
              width: isEdit ? '100%' : 'unset',
              pr: isEdit ? 0 : 7,
            },
            [theme.breakpoints.up('sm')]: {
              mt: 0,
              width: 'unset',
              pr: 7,
            },
          }}>
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
