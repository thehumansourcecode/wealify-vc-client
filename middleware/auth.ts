import i18n from '@nuxtjs/i18n'
import { AuthType } from '~/types/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const { $authToken } = useNuxtApp()
  const toast = useToast()
  const authStore = useAuthStore()
  if (!$authToken || !$authToken()) {
    authStore.openAuthForm(AuthType.LOGIN)
    toast.add({ title: i18n.t('notification.toast.loginRequired') })
    return navigateTo('/')
  }
})
