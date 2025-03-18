import type { IUserProfileData } from '~/types/profile'

export const useDashboardStore = defineStore('dashboard', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const userProfile = ref<IUserProfileData>()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n

  const isOpenTopupModal = ref(false)

  function toggleTopupModal(state: boolean) {
    isOpenTopupModal.value = state
  }

  const isOpenTransactionDetailSlideover = ref(false)

  function toggleTransactionDetailSlideover(state: boolean) {
    isOpenTransactionDetailSlideover.value = state
  }

  function resetUser() {
    userProfile.value = undefined
  }

  async function getProfile() {}

  return {
    userProfile,
    resetUser,
    getProfile,
    isOpenTopupModal,
    toggleTopupModal,
    isOpenTransactionDetailSlideover,
    toggleTransactionDetailSlideover,
  }
})
