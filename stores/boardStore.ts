import { v4 as uuid } from "uuid";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import boardData from "~/data/board.json";
import type { IData } from "~/data/board.types";

interface IAddTaskArg {
  columnIndex: number;
  taskName: string;
}

interface IMoveColumnFnArgs {
  fromColumnIndex: number;
  toColumnIndex: number;
}

interface IMovaTaskFnArgs extends IMoveColumnFnArgs {
  fromTaskIndex: number;
  toTaskIndex: number;
}

export const useBoardStore = defineStore("boardStore", () => {
  const board = useStorage<IData>("board", boardData);

  const getTask = computed(() => {
    return (taskId: string) => {
      for (const column of board.value.columns) {
        const task = column.tasks.find((task) => task.id === taskId);
        if (task) return task;
      }
    };
  });

  function addTask({ columnIndex, taskName }: IAddTaskArg): void {
    board.value.columns[columnIndex].tasks.push({
      id: uuid(),
      name: taskName,
      description: "",
    });
  }

  function deleteTask(taskId: string): void {
    board.value.columns.forEach((column) => {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);

      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        return;
      }
    });
  }

  function moveTask({
    fromTaskIndex,
    toTaskIndex,
    fromColumnIndex,
    toColumnIndex,
  }: IMovaTaskFnArgs) {
    const task = board.value.columns[fromColumnIndex].tasks.splice(fromTaskIndex, 1)[0];
    board.value.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task);
  }

  function addColumn(columnName: string): void {
    board.value.columns.push({
      name: columnName,
      tasks: [],
      id: uuid(),
    });
  }

  function deleteColumn(columnIndex: number): void {
    board.value.columns.splice(columnIndex, 1);
  }

  function moveColumn({
    fromColumnIndex,
    toColumnIndex,
  }: IMoveColumnFnArgs): void {
    const column = board.value.columns.splice(fromColumnIndex, 1)[0];
    board.value.columns.splice(toColumnIndex, 0, column);
  }

  return {
    board,
    getTask,
    addTask,
    deleteTask,
    moveTask,
    addColumn,
    deleteColumn,
    moveColumn,
  };
});
