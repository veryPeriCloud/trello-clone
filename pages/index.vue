<script setup lang="ts">
import { useBoardStore } from "~/stores/boardStore";
import { collection, addDoc } from "firebase/firestore";
import { useFirestore, useCollection } from "vuefire";

const db = useFirestore();
const { data: columns, pending} = useCollection(collection(db, 'columns'));

const route = useRoute();
const router = useRouter();
// const boardStore = useBoardStore();
const newColumnName = ref("");

const isModalOpen = computed(() => {
  return route.name === "index-tasks-id";
});

const addColumn = async () => {
  await addDoc(collection(db, "columns"), {
    name: newColumnName.value,
    createdAt: new Date.toString,
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
