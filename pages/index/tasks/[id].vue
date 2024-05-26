<script setup lang="ts">
import type { ITask } from "~/data/board.types";
import { collection, doc } from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";

const { db } = useNuxtApp();

const route = useRoute();
const router = useRouter();
const toast = useToast();

const taskId = computed<string>(() => {
  return route.params.id;
});

const columns = useCollection(collection(db, "columns"));

const task = computed(() => {
  for (const column of columns.value) {
    const task = column.tasks.find((task) => task.id === taskId.value);
    if (task) return task;
  }
});

const deleteTask = async () => {
  // boardStore.deleteTask(taskId.value);
  toast.add({
    title: "Task deleted.",
    description: `${task.value.name} has been deleted.`,
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
        />
      </UFormGroup>
      <UFormGroup label="Description" class="w-full mb-4">
        <UTextarea v-model="task.description" class="w-full" />
      </UFormGroup>
      <UButton icon="i-heroicons-trash" color="red" @click="deleteTask"
        >Delete task</UButton
      >
    </div>
    <div v-else>Task not found</div>
  </div>
</template>

<style scoped></style>
