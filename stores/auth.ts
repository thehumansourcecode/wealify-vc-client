import { authService, AuthService } from '~/services/auth.service'
import { type IRegisterRequestParams, type ILoginRequestParams, AuthType } from '~/types/auth'
import type { IUserProfileData } from '~/types/user'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref()
  const isAuthenticated = computed(() => !!accessToken.value)
  const userStore = useUserStore()

  function initializeAuth() {
    accessToken.value = localStorage.getItem('accessToken')
  }

  const userProfile = ref<IUserProfileData>()

  async function login(payload: ILoginRequestParams) {
    const response = await authService.login(payload)
    if (response.success) {
      const data = response?.data
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('accessTokenExpiresAt', data.accessTokenExpiresAt)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('refreshTokenExpiresAt', data.refreshTokenExpiresAt)
      initializeAuth()
      if (isAuthenticated.value) {
        await userStore.getProfile()
      }
      return response
    } else {
      // HANDLE MESSAGE
      return response
    }
  }

  async function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('accessTokenExpiresAt')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('refreshTokenExpiresAt')
    userStore.resetUser()
    const router = useRouter() // Access the router instance
    router.push('/')
  }

  return {
    isAuthenticated,
    initializeAuth,
    login,
    logout,
  }
})
