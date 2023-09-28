import { appConfigWithoutProviders } from '@bgd-labs/aave-governance-ui-helpers';

import { coreName } from './coreName';

export const appConfigForSSR = appConfigWithoutProviders(coreName);
