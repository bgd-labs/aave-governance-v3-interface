import { Box, useTheme } from '@mui/system';

import { Divider } from '../../ui';
import { CustomSkeleton } from '../../ui/components/CustomSkeleton';
import { NetworkIcon } from '../../ui/components/NetworkIcon';
import { getChainName } from '../../ui/utils/getChainName';
import { RpcSwitcherFormData } from '../store/providerSlice';
import { RpcSwitcherTableItemField } from './RpcSwitcherTableItemField';

export interface TableItemProps {
  rpcUrl?: string;
  chainId?: number;
  loading?: boolean;
  inputName?: string;
  isEdit?: boolean;
  isViewChanges?: boolean;
  formData?: RpcSwitcherFormData;
}

export function TableItem({
  chainId,
  loading,
  inputName,
  isEdit,
  isViewChanges,
  formData,
  rpcUrl,
}: TableItemProps) {
  const theme = useTheme();
  const formRpcUrl = formData?.find((item) => item.chainId === chainId)?.rpcUrl;
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          py: 20,
          [theme.breakpoints.up('xsm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
          },
          [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 110,
            py: 0,
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
              <Box component="h3" sx={{ typography: 'h3', fontWeight: 600 }}>
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
              mt: 12,
              width: '100%',
              pr: 0,
            },
            [theme.breakpoints.up('sm')]: {
              mt: 0,
              width: 'unset',
              pr: 7,
            },
          }}>
          {loading ? (
            <CustomSkeleton width={150} height={20} />
          ) : (
            <RpcSwitcherTableItemField
              isEdit={!!isEdit}
              isViewChanges={!!isViewChanges}
              inputName={`${inputName}.rpcUrl`}
              rpcUrl={rpcUrl}
              rpcUrlTo={formRpcUrl}
              chainId={chainId}
            />
          )}
        </Box>
      </Box>
      <Divider className="Divider" />
    </Box>
  );
}
