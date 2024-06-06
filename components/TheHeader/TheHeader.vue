<script setup lang="ts">
import { useUserStore } from "~/stores/userStore";

const userStore = useUserStore();
const toast = useToast();

const user = ref<IUser | null>(null);
const isResolved = ref(false);

onMounted(async () => {
  user.value = await userStore.getProfile();
  isResolved.value = true;
});

const items = [
  [
    {
      label: "",
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

const alt = computed(() =>
  user.value?.displayName
    ? user.value?.displayName[0].toUpperCase()
    : user.value?.email[0].toUpperCase()
);

const clickHandler = async (url: string): Promise<void> => {
  if (url === "/login") {
    await userStore
      .logOut()
      .then(() => {
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
  <header class="h-16 flex items-center py-3 px-3 shadow-lg bg-white">
    <nuxt-link
      to="/"
      class="font-bold hover:text-primary transition-all duration-200 ease-in"
    >
      Trello clone app
    </nuxt-link>

    <UDropdown
      :items="items"
      :ui="{
        rounded: 'rounded-2xl',
        item: { disabled: 'cursor-text select-text' },
      }"
      :popper="{ placement: 'bottom-start' }"
      class="ml-auto"
    >
      <UAvatar
        size="md"
        class="bg-primary-200 flex items-center justify-center"
        :alt="alt"
        :src="user?.photoURL"
      />

      <template #account="{ item }">
        <div class="text-left">
          <p>Signed in as</p>
          <p class="truncate font-medium text-gray-900 dark:text-white">
            {{ user.email }}
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
