<script setup lang="ts">
import { addDoc } from "firebase/firestore";

const { $columnsRef } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const newColumnName = ref("");

const isModalOpen = computed(() => {
  return route.name === "index-tasks-id";
});

const { data: columns, pending} = useCollection($columnsRef);

const addColumn = async () => {
  await addDoc($columnsRef, {
    name: newColumnName.value,
    tasks: [],
  });
  newColumnName.value = "";
};

const closeModal = () => {
  router.push("/");
};
</script>

<template>
  <div class="board-wrapper">
    <main class="board" v-if="!pending">
      <BoardColumn
        v-for="(column, columnIndex) in columns"
        :key="column.id"
        :column="column"
        :columnIndex="columnIndex"
      />

      <UContainer class="column">
        <UInput
          v-model="newColumnName"
          type="text"
          size="lg"
          icon="i-heroicons-plus-circle-solid"
          placeholder="Create new column"
          @keyup.enter="addColumn"
        />
      </UContainer>
    </main>
    <div v-show="isModalOpen" class="task-bg" @click.self="closeModal">
      <NuxtPage :key="route.fullPath" />
    </div>
  </div>
</template>

<style scoped></style>
