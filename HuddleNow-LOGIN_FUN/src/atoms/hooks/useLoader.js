import React from "react";
import { useUpdateAtom } from "jotai/utils";
import { showLoaderAtom, hideLoaderAtom } from "../loaderAtom";

const useLoader = () => {
  const showLoader = useUpdateAtom(showLoaderAtom);
  const hideLoader = useUpdateAtom(hideLoaderAtom);
  return { showLoader, hideLoader };
};

export default useLoader;
