<script setup lang="ts">
import TheHeader from "@/components/TheHeader/TheHeader.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const { uid } = user;
    localStorage.setItem("firebaseUser", uid);
  } else {
    navigateTo("/login");
  }
});
</script>

<template>
  <div class="w-screen">
    <the-header />
    <div class="bg-sky-200 overflow-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
