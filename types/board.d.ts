export interface ITask {
  id: string;
  name: string;
  description: string;
}

interface IColumn {
  id: string;
  name: string;
  tasks: ITask[];
  createdAt: string;
  userId: string;
}

interface IPickupArgs {
  fromColumnIndex: number;
  fromTaskIndex: number;
}

interface IDropFnArgs {
  toColumnIndex: number;
  toTaskIndex?: number;
  columnId: string;
}


interface IAddTaskArg {
  columnIndex: number;
  taskName: string;
  columnId: string;
}

interface IMoveColumnFnArgs {
  fromColumnIndex: number;
  toColumnIndex: number;
}

interface IMoveTaskFnArgs extends IMoveColumnFnArgs {
  fromTaskIndex: number;
  toTaskIndex: number;
}