<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { useUserStore } from "~/stores/userStore";

const userStore = useUserStore();
const toast = useToast();
const formData = reactive({
  email: "",
  password: "",
});

definePageMeta({
  layout: "auth",
  auth: false,
});

onMounted(() => {
  const user = useCurrentUser();
  if (user) {
    navigateTo("/", { replace: true });
  }
});

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>): Promise<void> {
  await userStore
    .register(formData)
    .then((user) => {
      if (user) {
        toast.add({
          title: "Sign up",
          description: "The account was created",
          icon: "i-heroicons-check",
          timeout: 2000,
          color: "green",
        });
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
  <div class="flex flex-col items-center justify-center w-1/2">
    <h1 class="text-3xl font-bold mb-5">Sign Up</h1>
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
        />
      </UFormGroup>

      <UButton type="submit" size="lg" class="w-full justify-center text-base">
        Sign up
      </UButton>
    </UForm>
  </div>
</template>

<style scoped></style>
