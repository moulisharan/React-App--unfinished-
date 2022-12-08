import React from "react";
import { useAtom } from "jotai";
import { todoDetailAtom } from "../todoAtom";

const useTodo = () => {
  const [todoDetail, updateTodo] = useAtom(todoDetailAtom);
  return { todoDetail, updateTodo };
};

export default useTodo;
