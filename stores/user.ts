import { userService } from '~/services/user.service'
import { type IUserBalance, type IUserProfile } from '~/types/user'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const userProfile = ref<IUserProfile>()
  const userBalance = ref<IUserBalance>()

  function resetUser() {
    userProfile.value = undefined
  }

  async function getProfile() {
    const response = await userService.getProfile()
    if (response.success) {
      userProfile.value = response.data
    }
  }

  async function getBalance() {
    const response = await userService.getBalance()
    if (response.success) {
      const balance = response.data
      userBalance.value = balance
    }
  }

  return {
    userProfile,
    resetUser,
    getProfile,
    userBalance,
    getBalance,
  }
})
