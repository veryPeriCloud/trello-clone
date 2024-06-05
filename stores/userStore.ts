import { v4 as uuid } from "uuid";
import { defineStore } from "pinia";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type { IColumn, ITask } from "~/types/board";

export const useUserStore = defineStore("userStore", () => {
  const { $db, $auth } = useNuxtApp();
  // const usersRef = doc($db, "users");
  // const user = ref(null);

  async function getProfile() {
    try {
      const userId = localStorage.getItem("firebaseUser") ?? '';
      const usersCollectionRef = doc($db, "users", userId);
      const data = await getDoc(usersCollectionRef);

      return { data: data.data() };
    } catch (error) {
      return { error };
    }
  }

  async function setProfile(data) {
    try {
      const userId = localStorage.getItem('firebaseUser') ?? '';
      const docRef = doc($db, "users", userId);
      await updateDoc(docRef, { ...data });

      return { data: userId };
    } catch (error) {
      return { error };
    }
  }

  return {
    getProfile,
    setProfile,
  };
});
