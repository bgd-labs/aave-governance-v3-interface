import { Box } from '@mui/system';
import React from 'react';
import { Field, Form } from 'react-final-form';

import { useStore } from '../../../store';
import { BackButton3D, BigButton, Input } from '../../../ui';
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
    console.log(impersonated);
    console.log(impersonatedAddress);
    await connectWallet('Impersonated', appConfig.govCoreChainId);
  };

  return (
    <Box
      sx={{ display: 'flex', width: '100%', flex: 1, flexDirection: 'column' }}>
      <BackButton3D
        isSmall
        alwaysWithBorders
        alwaysVisible
        onClick={() => closeClick(false)}
        wrapperCss={{ mb: 40 }}
      />
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
              <BigButton alwaysWithBorders type="submit" css={{ mt: 24 }}>
                {texts.walletConnect.impersonatedButtonTitle}
              </BigButton>
            </Box>
          )}
        </Form>
      </Box>
    </Box>
  );
}
