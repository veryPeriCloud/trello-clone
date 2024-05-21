// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/style.css'],
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', "@nuxt/ui", '@vueuse/nuxt', "nuxt-vuefire"],
  colorMode: {
    preference: "light"
  },
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGEING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },
})