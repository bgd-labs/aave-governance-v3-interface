import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { Box } from '@mui/system';
import React from 'react';
import { Field, Form } from 'react-final-form';

import { useStore } from '../../../store';
import { BigButton, Input } from '../../../ui';
import { texts } from '../../../ui/utils/texts';
import { appConfig } from '../../../utils/appConfig';

interface ImpersonatedFormProps {
  closeClick: (value: boolean) => void;
}

export function ImpersonatedForm({ closeClick }: ImpersonatedFormProps) {
  const { impersonated, setImpersonated, connectWallet } = useStore();

  const handleFormSubmit = async ({
    impersonatedAddress,
  }: {
    impersonatedAddress: string;
  }) => {
    setImpersonated(impersonatedAddress);
    await connectWallet(WalletType.Impersonated, appConfig.govCoreChainId);
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

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <BigButton alwaysWithBorders type="submit" css={{ mt: 60 }}>
                  {texts.walletConnect.impersonatedButtonTitle}
                </BigButton>
              </Box>
            </Box>
          )}
        </Form>
      </Box>
    </Box>
  );
}
