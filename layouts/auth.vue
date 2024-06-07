<template>
  <div class="flex min-h-screen">
    <div class="w-1/2 bg-indigo-700 hidden lg:flex flex-col items-center justify-center">
      <p class="text-xl font-medium text-yellow-500 mb-5">Trello clone app</p>
      <img src="../public/img/flame.png" alt="Human" />
    </div>

    <div class="w-full lg:w-1/2 p-3 flex items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
