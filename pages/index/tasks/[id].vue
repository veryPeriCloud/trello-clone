<script setup lang="ts">
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

const saveTaskChanges = async (task: ITask): Promise<void> => {
  await boardStore
    .editTask(task)
    .then((res) => {
      toast.add({
        title: "Task",
        description: `Task's changes have been saved.`,
        icon: "i-heroicons-check",
        timeout: 3000,
        color: "green",
      });
      router.push("/");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.add({
        title: errorCode,
        description: errorMessage,
        icon: "i-heroicons-exclamation-circle",
        timeout: 3000,
        color: "red",
      });
    });
};

const deleteTask = async (): Promise<void> => {
  await boardStore
    .deleteTask(taskId.value)
    .then((res) => {
      router.push("/");
      toast.add({
        title: "Task deleted.",
        description: `Task has been deleted.`,
        icon: "i-heroicons-trash",
        timeout: 3000,
        color: "red",
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.add({
        title: errorCode,
        description: errorMessage,
        icon: "i-heroicons-exclamation-circle",
        timeout: 3000,
        color: "red",
      });
    });
};
</script>

<template>
  <div class="task-wrapper">
    <form v-if="task" class="task-view" @submit.prevent="saveTaskChanges(task)">
      <UFormGroup label="Name" class="w-full mb-4">
        <UInput
          type="text"
          size="lg"
          v-model="task.name"
          class="w-full font-bold"
        />
      </UFormGroup>
      <UFormGroup label="Description" class="w-full mb-4">
        <UTextarea v-model="task.description" class="w-full" />
      </UFormGroup>

      <div class="flex w-full mb-4 gap-4">
        <UButton
          icon="i-heroicons-trash"
          size="md"
          color="red"
          @click="deleteTask"
          >Delete task</UButton
        >
        <UButton size="md" type="submit">Save changes</UButton>
      </div>
    </form>
    <div v-else>Task not found</div>
  </div>
</template>

<style scoped></style>
