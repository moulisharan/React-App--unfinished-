import React from "react";
import { Navigate } from "react-router-dom";
import { LOGIN_PATH } from "routes/routes";
import useAuth from "atoms/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate replace to={LOGIN_PATH} />;
};

export default ProtectedRoute;
