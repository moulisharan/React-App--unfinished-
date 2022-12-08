import React from "react";
import useAuth from "atoms/hooks/useAuth";
import { useNavigate } from "react-router-dom";

import { Wrapper, Button } from "./HomeContainer.styles.js";
import TodoDetail from 'components/todo/TodoDetail';

const HomeContainer = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLoggedIn(false);
    localStorage.clear()
    window.location.href = '/login'
  };
  

  return (
    <>
      <Wrapper>Home</Wrapper>
      <Button onClick={handleLoginClick}>Logout</Button>
      <TodoDetail />
    </>
  );
};

export default HomeContainer;
