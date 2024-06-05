import { getCurrentUser } from "vuefire";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();
  console.log('middleware', user)
  
  if (
    !user && to.path !== "/login" && to.path !== "/register"
  ) {
    return navigateTo("/login", { replace:true });
  }
})