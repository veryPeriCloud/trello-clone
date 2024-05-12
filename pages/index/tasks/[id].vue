<script setup lang="ts">
import { useBoardStore } from "~/stores/boardStore";
import type { ITask } from "~/data/board.types";

const boardStore = useBoardStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const taskId = computed<string>(() => {
  return route.params.id;
})

const task = computed<ITask>(() => {
  return boardStore.getTask(taskId.value);
});

const deleteTask = () => {
  toast.add({
    title: "Task deleted.",
    description: `${task.value.name} has been deleted.`,
    icon: "i-heroicons-trash",
    timeout: 3000,
    color: "red"
  })
  boardStore.deleteTask(taskId.value);
  router.push("/")
};
</script>

<template>
  <div class="task-wrapper">
    <div v-if="task" class="task-view">
      <UFormGroup label="Name" class="w-full mb-4">
        <UInput type="text" size="lg" v-model="task.name" class="w-full font-bold" />
      </UFormGroup>
      <UFormGroup label="Description" class="w-full mb-4">
        <UTextarea v-model="task.description" class="w-full" />
      </UFormGroup>
      <UButton icon="i-heroicons-trash" color="red" @click="deleteTask"
        >Delete task</UButton
      >
    </div>
    <section v-else>Task not found</section>
  </div>
</template>

<style scoped></style>
