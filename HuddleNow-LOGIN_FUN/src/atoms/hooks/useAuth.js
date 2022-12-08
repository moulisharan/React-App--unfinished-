import React from "react";
import { useAtom } from "jotai";
import { loginAtom } from "../authAtom";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(loginAtom);
  if (localStorage.getItem('accessToken')){
    setIsLoggedIn(true)
  }
  console.log(isLoggedIn)
  return { isLoggedIn, setIsLoggedIn };
};

export default useAuth;
