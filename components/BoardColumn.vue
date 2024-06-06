<script setup lang="ts">
import { useBoardStore } from "~/stores/boardStore";
import type { IColumn, IDropFnArgs, IPickupArgs } from "~/types/board";

const props = defineProps<{
  column: IColumn;
  columnIndex: number;
}>();

const boardStore = useBoardStore();

const editNameState = ref(false);
const newTaskName = ref("");

const editColumnName = async (): Promise<void> => {
  await boardStore.editColumn(props.column.id);
  editNameState.value = false;
};

const deleteColumn = async (column: IColumn): Promise<void> => {
  await boardStore.deleteColumn(column);
};

const goToTask = (taskId: string): void => {
  navigateTo(`/tasks/${taskId}`);
};

const addTask = async (): Promise<void> => {
  await boardStore.addTask({
    taskName: newTaskName.value,
    columnIndex: props.columnIndex,
    columnId: props.column.id,
  });
  newTaskName.value = "";
};

const pickupTask = (
  event: DragEvent,
  { fromColumnIndex, fromTaskIndex }: IPickupArgs
): void => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer?.setData("type", "task");
    event.dataTransfer?.setData(
      "from-column-index",
      fromColumnIndex.toString()
    );
    event.dataTransfer?.setData("from-task-index", fromTaskIndex.toString());
  }
};

const dropItem = async (
  event: DragEvent,
  { toColumnIndex, toTaskIndex }: IDropFnArgs
): Promise<void> => {
  const type = event.dataTransfer?.getData("type");
  const fromColumnIndex = Number(
    event.dataTransfer?.getData("from-column-index")
  );

  if (type === "task") {
    const fromTaskIndex = Number(
      event.dataTransfer?.getData("from-task-index")
    );

    boardStore.moveTask({
      fromTaskIndex,
      toTaskIndex,
      fromColumnIndex,
      toColumnIndex,
    });
  } else if (type === "column") {
    await boardStore.moveColumn({
      fromColumnIndex,
      toColumnIndex,
    });
  }
};

const pickupColumn = (event: DragEvent, fromColumnIndex: number): void => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer?.setData("type", "column");
    event.dataTransfer?.setData(
      "from-column-index",
      fromColumnIndex.toString()
    );
  }
};
</script>

<template>
  <UContainer
    class="column"
    draggable="true"
    @dragstart.self="pickupColumn($event, columnIndex)"
    @dragenter.prevent
    @dragover.prevent
    @drop.stop="dropItem($event, { toColumnIndex: columnIndex })"
  >
    <div class="column-header mb-4">
      <div>
        <UInput
          v-if="editNameState"
          type="text"
          size="lg"
          v-model="column.name"
          @blur="editColumnName"
          @keyup.enter="editColumnName"
        />
        <h2 v-else>{{ column.name }}</h2>
      </div>

      <UPopover :ui="{ rounded: 'rounded-2xl' }">
        <UButton
          variant="ghost"
          trailing-icon="i-heroicons-ellipsis-horizontal"
        ></UButton>

        <template #panel class="rounded-2xl">
          <div class="flex flex-col gap-2 p-2">
            <UButton
              icon="i-heroicons-pencil-square"
              variant="outline"
              @click="editNameState = !editNameState"
              >Edit</UButton
            >
            <UButton
              icon="i-heroicons-trash"
              class=""
              variant="outline"
              color="red"
              @click="deleteColumn(column)"
              >Delete</UButton
            >
          </div>
        </template>
      </UPopover>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard
          class="task-card"
          @click="goToTask(task.id)"
          draggable="true"
          @dragstart="
            pickupTask($event, {
              fromTaskIndex: taskIndex,
              fromColumnIndex: columnIndex,
            })
          "
          @drop.stop="
            dropItem($event, {
              toColumnIndex: columnIndex,
              toTaskIndex: taskIndex,
            })
          "
        >
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>
    <UInput
      v-model="newTaskName"
      type="text"
      size="lg"
      icon="i-heroicons-plus-circle-solid"
      placeholder="Create new task"
      @keyup.enter="addTask"
    />
  </UContainer>
</template>

<style scoped></style>
