import { atom } from "jotai";
import { isValidElementType } from "react-is";

export const loaderCountAtom = atom(0);
const customLoader = { customerLoader: null };
export const customLoaderAtom = atom(customLoader);

const isValid = (loader) => isValidElementType(loader);

export const showLoaderAtom = atom(null, (get, set, by) => {
  if (by.customLoader && isValid(by.customLoader)) {
    set(customLoaderAtom, { customerLoader: by.customLoader });
  }
  set(loaderCountAtom, get(loaderCountAtom) + 1);
});

export const hideLoaderAtom = atom(null, (get, set) => {
  const loaderCount = get(loaderCountAtom);
  if (loaderCount) {
    set(loaderCountAtom, loaderCount - 1);
    if (loaderCount === 1) {
      set(customLoaderAtom, customLoader);
    }
  }
});
