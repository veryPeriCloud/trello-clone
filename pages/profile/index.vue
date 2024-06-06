<script setup lang="ts">
import VLoader from "~/components/VLoader.vue";
import { useUserStore } from "~/stores/userStore";

const userStore = useUserStore();
const toast = useToast();

const user = ref<IUser | null>(null);
const isResolved = ref(false);
const file = ref(null);

onMounted(async () => {
  user.value = await userStore.getProfile();
  isResolved.value = true;
});

const letter = computed(() => {
  if (user.value) {
    if (user.value.displayName) {
      return user.value.displayName[0].toUpperCase();
    } else {
      return user.value.email[0].toUpperCase();
    }
  } else return;
});

const upload = async (): Promise<void> => {
  if (user.value && file.value) {
    user.value.photoURL = await getBase64(file.value.files[0]);
  } else return;
};

const getBase64 = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
  });
};

const removePhoto = (): void => {
  user.value.photoURL = null;
};

const saveChanges = async (): Promise<void> => {
  if (user) {
    await userStore
      .setProfile(user.value)
      .then((res) => {
        toast.add({
          title: "Profile",
          description: "Changes saved",
          icon: "i-heroicons-check",
          timeout: 2000,
          color: "green",
        });
        return res;
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

const cancelChanges = async (): Promise<void> => {
  isResolved.value = false;
  user.value = await userStore.getProfile();
  isResolved.value = true;
};
</script>

<template>
  <div class="board-wrapper">
    <v-loader v-if="!isResolved" />

    <UContainer class="max-w-5xl p-4 mx-auto bg-white rounded-2xl shadow">
      <h1 class="text-3xl font-bold mb-8">Profile</h1>

      <div v-if="isResolved && user">
        <div
          class="flex flex-col justify-center sm:flex-row items-center gap-5"
        >
          <div
            class="w-[100px] h-[100px] md:w-[150px] md:h-[150px] flex justify-center relative"
          >
            <div class="profile-img">
              <div v-if="user.photoURL">
                <img :src="user.photoURL" alt="User photo" />
              </div>

              <div v-else class="profile-letter">
                {{ letter }}
              </div>
            </div>
            <UButton
              v-if="user.photoURL"
              variant="ghost"
              class="absolute -top-4 -right-4"
              icon="i-heroicons-x-mark"
              @click.prevent="removePhoto"
            >
            </UButton>
          </div>
        </div>
        <form class="flex flex-col mt-8" @submit.prevent="saveChanges">
          <div class="flex justify-center relative mb-5">
            <input
              type="file"
              ref="file"
              class="absolute top-0 bottom-0 left-0 right-0 w-full opacity-0 cursor-pointer"
              @change="upload"
            />
            <UButton>Upload your photo</UButton>
          </div>
          <div  class="profile-field">
            <div class="w-1/3">E-mail:</div>
            <UInput class="w-full" disabled size="lg" v-model="user.email" />
          </div>

          <div  class="profile-field border-b-2">
            <label class="w-1/3">Profile name</label>
            <UInput class="w-full" size="lg" v-model="user.displayName" />
          </div>

          <div class="flex gap-5 mt-5 ml-auto">
            <UButton size="md" variant="ghost" @click.prevent="cancelChanges"
              >Cancel</UButton
            >
            <UButton size="md" type="submit"> Save changes</UButton>
          </div>
        </form>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.profile__label {
  @apply block mb-2;
}

.profile-img {
  @apply w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full text-gray-500 border border-primary-300 overflow-hidden justify-center;
}

.profile-letter {
  @apply bg-primary-200 w-full h-full flex items-center justify-center text-5xl font-bold text-white;
}

.btn-wrapper {
  @apply flex items-center justify-center sm:justify-start gap-5 w-full;
}

.profile-field {
  @apply border-t-2 border-gray-100 py-5 w-full flex gap-3 sm:gap-5 flex-col sm:flex-row;
}

.profile-avatar {
  @apply hidden;
}
</style>
