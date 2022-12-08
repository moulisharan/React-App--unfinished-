import React from "react";
import { loaderCountAtom } from "atoms/loaderAtom";
import { useAtomValue } from "jotai/utils";

import { LoaderWrapper } from "./LoaderContainer.styles";
// import Loader from 'components/assests/loader.svg'


const LoaderContainer = () => {
  const loaderCount = useAtomValue(loaderCountAtom);

  return <>{loaderCount > 0 && <LoaderWrapper>
  </LoaderWrapper>}</>;
};

export default LoaderContainer;
