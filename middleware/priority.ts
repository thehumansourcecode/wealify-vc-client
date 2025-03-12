import i18n from '@nuxtjs/i18n'
import { AuthType } from '~/types/auth'
import { UserTier } from '~/types/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const toast = useToast()
  const userStore = useUserStore()
  const authStore = useAuthStore()

  const { $authToken } = useNuxtApp()
  if (!$authToken || !$authToken()) {
    authStore.openAuthForm(AuthType.LOGIN)
    toast.add({ title: i18n.t('notification.toast.loginRequired') })
    return navigateTo('/')
  }

  await userStore.getProfile()
  console.log(userStore?.userProfile?.tier)

  if (userStore?.userProfile?.tier !== UserTier.GLOBAL_ELITE && userStore?.userProfile?.tier !== UserTier.SUPREME) {
    toast.add({ title: 'You must reach at least Supreme rank to unlock this feature' })
    return navigateTo('/')
  }
})
