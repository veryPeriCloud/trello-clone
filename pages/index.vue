<script setup lang="ts">
import VLoader from "~/components/VLoader.vue";
import { useBoardStore } from "~/stores/boardStore.ts";

const boardStore = useBoardStore();
const isResolved = ref(false);

const route = useRoute();
const router = useRouter();
const newColumnName = ref("");

const isModalOpen = computed(() => {
  return route.name === "index-tasks-id";
});

onMounted(async() => {
  await boardStore.setBoardData();
  isResolved.value = true;
});

const columns = computed(() => boardStore.board)

const addColumn = async(): Promise<void> => {
  if (newColumnName.value.length === 0) return;
  await boardStore.addColumn(newColumnName.value);
  isResolved.value = true;
  newColumnName.value = "";
};

const closeModal = async() => {
  router.push("/");
};
</script>

<template>
  <div class="board-wrapper">

    <v-loader v-if="!isResolved" />
    <main class="board" v-if="isResolved">
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
