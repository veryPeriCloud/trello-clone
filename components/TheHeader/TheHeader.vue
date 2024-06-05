<script setup lang="ts">
import { signOut } from "firebase/auth";

const { $auth } = useNuxtApp();

const user = $auth.currentUser;
const toast = useToast();

const items = [
  [
    {
      label: user?.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Profile",
      icon: "i-heroicons-cog-8-tooth",
      url: "/profile",
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      url: "/login",
    },
  ],
];

const clickHandler = (url: string): void => {
  if (url === "/login") {
    signOut($auth)
      .then(() => {
        console.log("sign out");
        toast.add({
          title: "Sign out",
          icon: "i-heroicons-check",
          timeout: 2000,
          color: "green",
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
  } else return;
};
</script>

<template>
  <header class="h-16 flex items-center py-3 px-3 bg-white shadow-lg">
    <nuxt-link to="/" class="font-bold">Trello clone </nuxt-link>

    <UDropdown
      :items="items"
      :ui="{ item: { disabled: 'cursor-text select-text' } }"
      :popper="{ placement: 'bottom-start' }"
      class="ml-auto"
    >
      <UAvatar size="md" icon="i-heroicons-user-circle" />

      <template #account="{ item }">
        <div class="text-left">
          <p>Signed in as</p>
          <p class="truncate font-medium text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
        </div>
      </template>

      <template #item="{ item }">
        <nuxt-link
          :to="item.url"
          class="w-full flex items-center justify-between"
          @click.native="clickHandler(item.url)"
        >
          <span class="truncate">{{ item.label }}</span>

          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
          />
        </nuxt-link>
      </template>
    </UDropdown>
  </header>
</template>

<style scoped></style>
