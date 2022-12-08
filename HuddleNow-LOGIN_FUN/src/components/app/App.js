import React from "react";
import { Provider } from "jotai";
import { BrowserRouter } from "react-router-dom";
import NetworkInterceptors from 'api/network/NetworkInterceptors';
import LoaderContainer from "components/common/loader/LoaderContainer";
import AppController from "./AppController";
import useAuth from "atoms/hooks/useAuth";

const App = () => {
    // const { isLoggedIn, setIsLoggedIn } = useAuth();
    // if (localStorage.getItem('accessToken')){
    //  setIsLoggedIn(true)
    // }
    // console.log(isLoggedIn)
  return (
    <Provider>
      <BrowserRouter>
          <NetworkInterceptors />
          <LoaderContainer /> 
          <AppController />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
