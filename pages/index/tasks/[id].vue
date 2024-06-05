<script setup lang="ts">
import type { ITask } from '~/types/board';


const boardStore = useBoardStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const board = computed(() => boardStore.board);
const taskId = computed<string>(() => {
  return route.params.id;
});

const task = computed(() => {
  for (const column of board.value) {
    const task = column.tasks.find((task) => task.id === taskId.value);
    if (task) return task;
  }
});

const editTask = async(task: ITask): Promise<void>  =>{
  await boardStore.editTask(task);
}

const deleteTask = async(): Promise<void> => {
  await boardStore.deleteTask(taskId.value);
  toast.add({
    title: "Task deleted.",
    description: `Task has been deleted.`,
    icon: "i-heroicons-trash",
    timeout: 3000,
    color: "red",
  });
  router.push("/");
};
</script>

<template>
  <div class="task-wrapper">
    <div v-if="task" class="task-view">
      <UFormGroup label="Name" class="w-full mb-4">
        <UInput
          type="text"
          size="lg"
          v-model="task.name"
          class="w-full font-bold"
          @update:modelValue="editTask"
        />
      </UFormGroup>
      <UFormGroup label="Description" class="w-full mb-4">
        <UTextarea v-model="task.description" @update:modelValue="editTask(task)" class="w-full" />
      </UFormGroup>
      <UButton icon="i-heroicons-trash" color="red" @click="deleteTask"
        >Delete task</UButton
      >
    </div>
    <div v-else>Task not found</div>
  </div>
</template>

<style scoped></style>
