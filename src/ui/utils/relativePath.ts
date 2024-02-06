import { isForIPFS } from '../../utils/appConfig';

export const setRelativePath = (path: string) => {
  if (typeof window !== 'undefined') {
    const { pathname } = window.location;
    const ipfsMatch = /.*\/Qm\w{44}\//.exec(pathname);
    const basePath = ipfsMatch ? ipfsMatch[0] : '';
    return isForIPFS ? `${basePath}${path}` : path;
  } else {
    return path;
  }
};
