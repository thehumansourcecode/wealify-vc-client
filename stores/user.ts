import { userService } from '~/services/user.service'
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

  async function getProfile() {
    const response = await userService.getProfile()
    console.log(response)
  }

  return {
    userProfile,
    resetUser,
    getProfile,
  }
})
