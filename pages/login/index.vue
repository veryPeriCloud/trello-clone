<script setup lang="ts">
import { z } from "zod";
import { type UserCredential } from "firebase/auth";
import { useUserStore } from "~/stores/userStore";

definePageMeta({
  layout: "auth",
  auth: false,
});

const userStore = useUserStore();
const toast = useToast();
const formData = reactive({
  email: "",
  password: "",
});

onMounted(() => {
  const user = useCurrentUser();
  if (user.value) {
    navigateTo("/", { replace: true });
  }
});

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});
type Schema = z.output<typeof schema>;

async function onSubmit(): Promise<void> {
  await userStore
    .logIn(formData)
    .then((userCredential: UserCredential) => {
      const user = userCredential.user;
      toast.add({
        title: "Auth",
        description: "Authorization was successful",
        icon: "i-heroicons-check",
        timeout: 2000,
        color: "green",
      });
      if (user) {
        navigateTo("/", { replace: true });
      }
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
}
</script>

<template>
  <div class="flex flex-col items-center justify-center w-full max-w-[320px] sm:w-1/2">
    <div class="flex lg:hidden flex-col items-center justify-center mb-5">
      <p class="text-xl font-medium text-yellow-500 mb-2">Trello clone app</p>
      <img src="../../public/img/flame.png" alt="Human" class="h-[80px]" />
    </div>

    <h1 class="text-3xl font-bold mb-5">Login</h1>
    <UForm
      :schema="schema"
      :state="formData"
      class="space-y-4 w-full"
      @submit="onSubmit"
    >
      <UFormGroup label="Email" name="email">
        <UInput
          v-model="formData.email"
          size="md"
          icon="i-heroicons-envelope"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput
          v-model="formData.password"
          type="password"
          size="md"
          icon="i-heroicons-lock-closed"
          autocomplete="current-password"
        />
      </UFormGroup>

      <UButton type="submit" size="lg" class="w-full justify-center text-base">
        Login
      </UButton>
    </UForm>
    <div class="mt-5">
      Don't have an account then
      <nuxt-link :to="'/register'" class="text-primary font-medium"
        >Sign-up</nuxt-link
      >
    </div>
  </div>
</template>

<style scoped></style>
