<template>
  <div class="relative w-full h-full">
    <div class="overlay">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.overlay {
  @apply flex items-center justify-center w-full h-full;
  @apply fixed inset-0 top-[64px];
  background: rgba(255, 255, 255, 0.1);

}
.loader {
  @apply inline-block w-[50px] h-[50px] relative;
  &:before,
  &:after {
    @apply content-[''] w-full  h-full rounded-full opacity-60 absolute inset-0 bg-primary-400;
    animation: loader 2s infinite ease-in-out;
  }
  &:after {
    animation-delay: -1s;
  }
}

@keyframes loader {
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}
</style>
