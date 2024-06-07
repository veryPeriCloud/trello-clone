import { defineStore } from "pinia";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type UserCredential } from "firebase/auth";

export const useUserStore = defineStore("userStore", () => {
  const { $db, $auth } = useNuxtApp();
  const userId = localStorage.getItem("firebaseUser");
  
  async function getProfile(): Promise<IUser> {
    const userId = localStorage.getItem("firebaseUser");
    const usersCollectionRef = doc($db, "users", userId);
    const data = await getDoc(usersCollectionRef);

    return data.data() as IUser;
  }

  async function setProfile(data: IUser): Promise<void> {
    const usersCollectionRef = doc($db, "users", userId);
    await updateDoc(usersCollectionRef, { ...data });
  }

  async function logIn(formData: IUser):Promise<UserCredential> {
    return await signInWithEmailAndPassword($auth, formData.email, formData.password)
  }

  async function register(formData: IUser) {
    const user: UserCredential = await createUserWithEmailAndPassword(
      $auth,
      formData.email,
      formData.password
    );
    await setDoc(doc($db, "users", user.user?.uid), formData);
    return user.user
  }

  async function logOut(): Promise<void> {
    await signOut($auth);
  }

  return {
    getProfile,
    setProfile,
    logIn,
    register,
    logOut,
  };
});
