<script setup lang="ts">
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useBoardStore } from "~/stores/boardStore";
import VDotsDropdown from "./VDotsDropdown.vue";
import { colors } from "~/assets/ts/colors";
import type { ITask } from "~/data/board.types";

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
  columnIndex: {
    type: Number,
    required: true,
  },
});

const { $db } = useNuxtApp();
const router = useRouter();
const boardStore = useBoardStore();
const editNameState = ref(false);
const newTaskName = ref("");

const deleteColumn = async (id: number): Promise<void> => {
  await deleteDoc(doc($db, "columns", id));
};

const gotToTask = (taskId: string): void => {
  router.push(`/tasks/${taskId}`);
};

const addTask = (): void => {
  boardStore.addTask({
    taskName: newTaskName.value,
    columnIndex: props.columnIndex,
  });
  newTaskName.value = "";
};

interface IPickupArgs {
  fromColumnIndex: number;
  fromTaskIndex: number;
}

interface IDropFnArgs {
  toColumnIndex: number;
  toTaskIndex?: undefined | number;
}

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

const dropItem = (
  event: DragEvent,
  { toColumnIndex, toTaskIndex }: IDropFnArgs
): void => {
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
    boardStore.moveColumn({
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

const getRandomColor = computed(() => {
  return colors[Math.floor(Math.random() * colors.length)];
});

interface IColumn {
  id: string;
  name: string;
  tasks: ITask;
}
const editColumnName = async (column: IColumn): Promise<void> => {
  const columnRef = doc($db, "columns", column.id);
  await updateDoc(columnRef, {
    name: column.name,
  })
  .then(() => {
      editNameState.value = false;
      toast.add({
        title: "Column name updated.",
        description: `${column.name} has been deleted.`,
        icon: "i-heroicons-check",
        timeout: 3000,
        color: "green",
      });
    })
    .catch((error) => {});
};
</script>

<template>
  <UContainer
    class="column border-t-[4px]"
    :style="{ 'border-color': `${getRandomColor}` }"
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
          @blur="editColumnName(column)"
        />
        <h2 v-else>{{ column.name }}</h2>
      </div>
      <v-dots-dropdown>
        <div class="flex flex-col gap-2">
          <UButton
            icon="i-heroicons-pencil-square"
            class="mr-2 text-black"
            @click="editNameState = !editNameState"
            >Edit</UButton
          >
          <UButton
            icon="i-heroicons-trash"
            class="mr-2 text-red-500"
            color="red"
            @click="deleteColumn(column.id)"
            >Delete</UButton
          >
        </div>
      </v-dots-dropdown>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard
          class="mb-4 cursor-pointer hover:shadow-lg"
          @click="gotToTask(task.id)"
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
