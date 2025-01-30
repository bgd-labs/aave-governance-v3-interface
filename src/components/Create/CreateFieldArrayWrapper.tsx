import { Box } from '@mui/system';
import { ReactNode } from 'react';

import CloseIcon from '../../assets/icons/cross.svg';
import { BoxWith3D } from '../BoxWith3D';
import { IconBox } from '../primitives/IconBox';

interface CreateFieldArrayWrapperProps {
  fieldTitle: string;
  onRemoveClick: () => void;
  children: ReactNode;
}

export function CreateFieldArrayWrapper({
  fieldTitle,
  onRemoveClick,
  children,
}: CreateFieldArrayWrapperProps) {
  return (
    <BoxWith3D
      borderSize={4}
      contentColor="$mainLight"
      wrapperCss={{
        mb: 20,
        position: 'relative',
        zIndex: 4,
        '&:focus-within': { zIndex: 5 },
      }}
      css={{ p: 10 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 12,
        }}>
        <Box component="p" sx={{ typography: 'headline' }}>
          {fieldTitle}
        </Box>
        <Box
          sx={{
            width: 13,
            height: 13,
            hover: {
              opacity: '0.7',
            },
          }}
          component="button"
          type="button"
          onClick={onRemoveClick}>
          <IconBox
            sx={{
              width: 13,
              height: 13,
              '> svg': {
                width: 13,
                height: 13,
              },
              path: (theme) => ({
                stroke: theme.palette.$main,
                fill: theme.palette.$main,
              }),
            }}>
            <CloseIcon />
          </IconBox>
        </Box>
      </Box>

      {children}
    </BoxWith3D>
  );
}
