import React from "react";
import ToDoAPI from "api/todoApi/fetchTodo/api";
import useTodo from "atoms/hooks/useTodo";
import { Wrapper, Button } from "./TodoDetail.styles.js";

const TodoDetail = () => {
  const { todoDetail, updateTodo } = useTodo();

  const onButtonClick = () => {
    new ToDoAPI({ todoId: 1 })
      .execute()
      .then((res) => {
        updateTodo(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Wrapper>Todo List</Wrapper>
      <Wrapper>{todoDetail}</Wrapper>
      <Button onClick={onButtonClick}>
        <span>Get Todo</span>
      </Button>
    </>
  );
};

export default TodoDetail;
