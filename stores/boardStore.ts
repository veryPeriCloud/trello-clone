import { v4 as uuid } from "uuid";
import { defineStore } from "pinia";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import type { IAddTaskArg, IColumn, IMoveTaskFnArgs, IMoveColumnFnArgs, ITask } from "~/types/board";

export const useBoardStore = defineStore("boardStore", () => {
  const { $db } = useNuxtApp();
  const columnsDataRef = doc($db, "columns", "data");
  const board = ref<IColumn[]>([]);
  const userId = localStorage.getItem("firebaseUser");

  async function getAllBoardData(): Promise<IColumn[]> {
    return await getDoc(columnsDataRef).then((doc) => {
      return doc.data()?.data;
    });
  }

  async function getBoardData(): Promise<IColumn[]> {
    return await getDoc(columnsDataRef).then((doc) => {
      return doc.data()?.data.filter((item: IColumn) => item.userId === userId);
    });
  }

  async function setBoardData(): Promise<void> {
    board.value = await getBoardData();
  }

  async function updateColumn(updatedData: IColumn[]): Promise<void> {
    const boardFromDataBase = await getAllBoardData();
    const boardNotUser = boardFromDataBase.filter((item) => item.userId !== userId)
    await updateDoc(columnsDataRef, {
      data: [...boardNotUser, ...updatedData],
    });
    await setBoardData();
  }

  async function addColumn(newColumnName: string): Promise<void> {
    await updateDoc(columnsDataRef, {
      data: arrayUnion({
        id: uuid(),
        name: newColumnName,
        tasks: [],
        createdAt: new Date().toISOString(),
        userId,
      }),
    });
    await setBoardData();
  }

  async function deleteColumn(column: IColumn): Promise<void> {
    await updateDoc(columnsDataRef, {
      data: arrayRemove(column),
    });
    await setBoardData();
  }

  async function editColumn(id?: string): Promise<void> {
    const boardFromDataBase = await getAllBoardData();
    const editedColumn = board.value.find(item => {
      if (item.id === id) return item
    })

    const data = boardFromDataBase.map(item => {
      if (item.id === id) {
        item = {...editedColumn}
      }
      return item
    })

    await updateDoc(columnsDataRef, {
      data: data,
    });
    await setBoardData();
  }

  async function moveColumn({
    fromColumnIndex,
    toColumnIndex
  }: IMoveColumnFnArgs): Promise<void> {
    const column = board.value.splice(fromColumnIndex, 1)[0];
    board.value.splice(toColumnIndex, 0, column);

    await updateColumn(board.value)
  }

  const getTask = computed(() => {
    return (taskId: string) => {
      for (const column of board.value) {
        const task = column.tasks.find((task) => task.id === taskId);
        if (task) return task;
      }
    };
  });

  async function addTask({
    columnIndex,
    taskName,
    columnId
  }: IAddTaskArg): Promise<void> {
    board.value[columnIndex].tasks.push({
      id: uuid(),
      name: taskName,
      description: "",
    });
    await editColumn(columnId);
  }

  async function editTask(task: ITask): Promise<void> {
    let columnId;
    board.value.forEach((column) => {
      column.tasks.map((t) => {
        if (t.id === task.id) {
          columnId = column.id;
          task = { ...task };
        }
      });
    });
    await editColumn(columnId);
  }

  async function deleteTask(taskId: string): Promise<void> {
    let columnId;
    board.value.forEach((column) => {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);

      if (taskIndex !== -1) {
        columnId = column.id;
        column.tasks.splice(taskIndex, 1);
        return;
      }
    });
    await editColumn(columnId);
  }

  async function moveTask({
    fromTaskIndex,
    toTaskIndex,
    fromColumnIndex,
    toColumnIndex,
  }: IMoveTaskFnArgs) {

    const task = board.value[fromColumnIndex].tasks.splice(fromTaskIndex, 1)[0];
    board.value[toColumnIndex].tasks.splice(toTaskIndex, 0, task);

    await updateColumn(board.value)
  }

  return {
    board,
    setBoardData,
    addColumn,
    deleteColumn,
    editColumn,
    addTask,
    deleteTask,
    editTask,
    moveTask,
    moveColumn,
  };
});
