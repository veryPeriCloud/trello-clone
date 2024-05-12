<template>
  <div class="v-dots-dd">
    <button
      class="v-dots-dd__btn"
      @click.stop="toggleDropdown"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16.0007 14.6667C16.7473 14.6667 17.334 15.2667 17.334 16C17.334 16.7333 16.734 17.3333 16.0007 17.3333C15.2673 17.3333 14.6673 16.7333 14.6673 16C14.6673 15.2667 15.254 14.6667 16.0007 14.6667Z"
          fill="currentColor"
        />
        <path
          d="M10.6667 14.6667C11.4133 14.6667 12 15.2667 12 16C12 16.7333 11.4 17.3333 10.6667 17.3333C9.93333 17.3333 9.33333 16.7333 9.33333 16C9.33333 15.2667 9.92 14.6667 10.6667 14.6667Z"
          fill="currentColor"
        />
        <path
          d="M21.3327 14.6667C22.0793 14.6667 22.666 15.2667 22.666 16C22.666 16.7333 22.066 17.3333 21.3327 17.3333C20.5993 17.3333 19.9993 16.7333 19.9993 16C19.9993 15.2667 20.586 14.6667 21.3327 14.6667Z"
          fill="currentColor"
        />
      </svg>
    </button>

    <div
      class="v-dots-dd__menu"
      v-if="opened"
      v-on-click-outside.bubble="onClickOutside"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";

const opened = ref(false);

const toggleDropdown = () => {
  opened.value = !opened.value;
};

const onClickOutside = () => {
  opened.value = false;
};
</script>

<style lang="scss" scoped>
.v-dots-dd {
  @apply relative;
}

.v-dots-dd__btn {
  @apply flex items-center rounded-lg transition duration-200 text-gray-900 hover:text-primary-500;
  @apply transition-all duration-200 ease-in-out;
}

.v-dots-dd__menu {
  @apply absolute right-0 p-2 bg-white border border-gray-200 z-10 rounded;
  min-width: 100px;
  max-width: 300px;

  & :deep(a),
  & :deep(button) {
    @apply w-full flex text-xs leading-6 text-left px-2 bg-gray-100 rounded hover:opacity-80;
  }
}

.v-dots-dd__close {
  @apply absolute right-0 -top-6 bg-transparent z-10;
}
</style>
