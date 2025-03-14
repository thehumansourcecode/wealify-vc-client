import { CommonLanguage } from "~/types/common"

export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  console.log(i18n.locale.value, 'middleware 1')
  i18n.setLocale(CommonLanguage.EN) // Default locale
})
