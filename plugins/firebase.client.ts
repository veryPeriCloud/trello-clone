import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  const auth = getAuth(nuxtApp.$firebaseApp);
  const db = getFirestore(nuxtApp.$firebaseApp);

  return {
    provide: {
      auth,
      db
    },
  };
});