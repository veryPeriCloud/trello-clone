<script setup lang="ts">
import { useUserStore } from "~/stores/userStore";

const userStore = useUserStore();
const toast = useToast();

const user = ref<IUser | null>(null);
const isResolved = ref(false);

onMounted(async() => {
  user.value = await userStore.getProfile();
  isResolved.value = true;
});

const items = ref([
  [
    {
      label: user.value?.email,
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
]);

const alt = computed(() =>
  user?.value?.displayName
    ? user.value.displayName[0].toUpperCase()
    : user.value?.email ? user.value.email[0].toUpperCase() : ''
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
        localStorage.removeItem("firebaseUser");
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
      class="flex gap-1 font-bold text-primary hover:text-primary-600 transition-all duration-200 ease-in"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="orange"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
        />
      </svg>
      Trello clone app
    </nuxt-link>

    <UDropdown
      v-if="isResolved"
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
            {{ user?.email }}
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
