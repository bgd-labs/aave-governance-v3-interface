import { Box } from '@mui/system';

import { Container } from '../primitives/Container';
import NoSSR from '../primitives/NoSSR';
import { texts } from '../utils/texts';
import { NoDataWrapper } from './NoDataWrapper';
import { RocketLoader } from './RocketLoader';

export function AppLoading() {
  return (
    <NoSSR>
      <Container>
        <NoDataWrapper>
          <RocketLoader />
          <Box component="h2" sx={{ typography: 'h2', mt: 24, maxWidth: 480 }}>
            {texts.other.appLoading}
          </Box>
        </NoDataWrapper>
      </Container>
    </NoSSR>
  );
}
