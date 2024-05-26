import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  const auth = getAuth(nuxtApp.$firebaseApp);
  const db = getFirestore(nuxtApp.$firebaseApp);
  const columnsRef = collection(db, "columns");

  return {
    provide: {
      auth,
      db,
      columnsRef,
    },
  };
});