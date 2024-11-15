import { getChains } from '../utils/getChains';
import { getInitialRpcUrls } from '../utils/getInitialRpcUrls';

export const initialRpcUrls = getInitialRpcUrls({});
export const CHAINS = getChains({ initialRpcUrls });
