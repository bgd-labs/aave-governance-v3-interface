import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { isAddress } from 'viem';

import { useStore } from '../../../store/ZustandStoreProvider';
import { BigButton, Input } from '../../../ui';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';
import { isEnsName } from '../../utils/ensHelpers';

export function ImpersonatedForm() {
  const impersonated = useStore((store) => store.impersonated);
  const setImpersonated = useStore((store) => store.setImpersonated);
  const connectWallet = useStore((store) => store.connectWallet);
  const fetchAddressByEnsName = useStore(
    (store) => store.fetchAddressByEnsName,
  );

  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleFormSubmit = async ({
    impersonatedAddress,
  }: {
    impersonatedAddress: string;
  }) => {
    setError(undefined);
    setIsResolving(true);

    try {
      let resolvedAddress = impersonatedAddress;

      if (isEnsName(impersonatedAddress)) {
        const resolved = await fetchAddressByEnsName(impersonatedAddress);
        if (!resolved) {
          setError('Invalid ENS name or address not found');
          setIsResolving(false);
          return;
        }
        resolvedAddress = resolved;
      } else if (!isAddress(impersonatedAddress)) {
        setError('Invalid address format');
        setIsResolving(false);
        return;
      }

      setImpersonated(resolvedAddress);
      await connectWallet(WalletType.Impersonated, appConfig.govCoreChainId);
    } catch (err) {
      setError('Failed to resolve address');
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <Box
      sx={{ display: 'flex', width: '100%', flex: 1, flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Form<{ impersonatedAddress: string }>
          onSubmit={handleFormSubmit}
          initialValues={{
            impersonatedAddress: impersonated?.address,
          }}>
          {({ handleSubmit, values }) => (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Field name="impersonatedAddress">
                {(props) => (
                  <Input
                    type="text"
                    placeholder={
                      texts.walletConnect.impersonatedInputPlaceholder
                    }
                    {...props.input}
                  />
                )}
              </Field>

              {error && (
                <Box
                  sx={{
                    color: '$error',
                    fontSize: 12,
                    mt: 8,
                    textAlign: 'center',
                  }}>
                  {error}
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <BigButton
                  alwaysWithBorders
                  type="submit"
                  css={{ mt: 60 }}
                  disabled={isResolving}>
                  {isResolving
                    ? 'Resolving...'
                    : texts.walletConnect.impersonatedButtonTitle}
                </BigButton>
              </Box>
            </Box>
          )}
        </Form>
      </Box>
    </Box>
  );
}
