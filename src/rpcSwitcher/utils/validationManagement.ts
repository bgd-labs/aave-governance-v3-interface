import { RpcSwitcherFormData } from '../store/providerSlice';

export let initialForm: RpcSwitcherFormData = [];

// form with changed and validated values
export let checkedForm: { [chainId: number]: string } = {};

const toMap = (arr: RpcSwitcherFormData) => {
  return arr.reduce(
    (acc, { chainId, rpcUrl }) => {
      acc[chainId] = rpcUrl;
      return acc;
    },
    {} as { [chainId: number]: string },
  );
};

// check what rpc was changed to prevent validation on every field
const getChangedUrls = (
  initialArray: RpcSwitcherFormData,
  currentArray: RpcSwitcherFormData,
) => {
  const initialMap = toMap(initialArray);
  const currentMap = toMap(currentArray);

  const changed = [];

  // Iterate over each chainId in the currentMap
  for (const chainId in currentMap) {
    if (initialMap[chainId] !== currentMap[chainId]) {
      changed.push({
        chainId: +chainId,
        rpcUrl: currentMap[chainId],
      });
    }
  }

  return changed;
};

// check if values were changed
export const checkValues = (
  initialArray: RpcSwitcherFormData,
  currentArray: RpcSwitcherFormData,
) => {
  const changed = getChangedUrls(initialArray, currentArray);
  if (changed.length) {
    initialForm = currentArray;
    changed.forEach(({ chainId, rpcUrl }) => {
      checkedForm[chainId] = rpcUrl;
    });
  }
};

export const setInitialForm = (form: RpcSwitcherFormData) => {
  initialForm = form;
};

// get input name index
export const extractIndexFromInputName = (inputName: string): number | null => {
  const match = inputName.match(/\[(\d+)\]/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
};

// debounce for async functions
export const debounceAsync = <T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number,
) => {
  let timerID: any;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    clearTimeout(timerID);

    const promiseForFunc = new Promise<ReturnType<T>>((resolve, reject) => {
      timerID = setTimeout(() => {
        func(...args)
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      }, wait);
    });

    return promiseForFunc;
  };
};
