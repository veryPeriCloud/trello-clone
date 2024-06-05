<template>
  <div class="board-wrapper">
    Profile page
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore';

const userStore = useUserStore();

// const profile = computed(() => userStore.getProfile)
onMounted(async()=> {
  const { data } =  await userStore.getProfile();
  console.log(data)
})
// if (user !== null) {
//   // The user object has basic properties such as display name, email, etc.
//   const displayName = user.displayName;
//   const email = user.email;
//   const photoURL = user.photoURL;
//   const emailVerified = user.emailVerified;

//   // The user's ID, unique to the Firebase project. Do NOT use
//   // this value to authenticate with your backend server, if
//   // you have one. Use User.getToken() instead.
//   const uid = user.uid;
// }

</script>

<style scoped>

</style>