import type { IUserProfileData } from '~/types/user'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const userProfile = ref<IUserProfileData>()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n

  function resetUser() {
    userProfile.value = undefined
  }

  async function getProfile() {}

  return {
    userProfile,
    resetUser,
    getProfile,
  }
})
