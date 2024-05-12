export interface ITask {
  id: string;
  name: string;
  description: string;
}

interface IColumn {
  id: string;
  name: string;
  tasks: ITask[];
}

export interface IData {
  name: string;
  columns: IColumn[];
}