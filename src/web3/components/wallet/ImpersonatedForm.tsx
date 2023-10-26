import { Box } from '@mui/system';
import React from 'react';
import { Field, Form } from 'react-final-form';
import { Hex, zeroAddress } from 'viem';

import { useStore } from '../../../store';
import { BackButton3D, BigButton, Input } from '../../../ui';
import { texts } from '../../../ui/utils/texts';

interface ImpersonatedFormProps {
  closeClick: (value: boolean) => void;
}

export function ImpersonatedForm({ closeClick }: ImpersonatedFormProps) {
  const impersonated = useStore((state) => state.impersonated);
  const setImpersonated = useStore((state) => state.setImpersonated);
  const connectWallet = useStore((state) => state.connectWallet);

  const handleFormSubmit = async ({
    impersonatedAddress,
  }: {
    impersonatedAddress: Hex;
  }) => {
    setImpersonated(impersonatedAddress);
    await connectWallet('Impersonated');
  };

  return (
    <Box
      sx={{ display: 'flex', width: '100%', flex: 1, flexDirection: 'column' }}>
      <BackButton3D
        isSmall
        alwaysWithBorders
        alwaysVisible
        onClick={() => closeClick(false)}
        wrapperCss={{ mt: 40 }}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Form<{ impersonatedAddress: Hex }>
          onSubmit={handleFormSubmit}
          initialValues={{
            impersonatedAddress: impersonated?.address || zeroAddress,
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
