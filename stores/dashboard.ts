import type { IUserProfile } from '~/types/user'

export const useDashboardStore = defineStore('dashboard', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const userProfile = ref<IUserProfile>()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n

  const isOpenWalletTopupModal = ref(false)

  function toggleWalletTopupModal(state: boolean) {
    isOpenWalletTopupModal.value = state
  }

  const isOpenTransactionDetailSlideover = ref(false)

  function toggleTransactionDetailSlideover(state: boolean) {
    isOpenTransactionDetailSlideover.value = state
  }

  function resetUser() {
    userProfile.value = undefined
  }

  return {
    userProfile,
    resetUser,
    isOpenWalletTopupModal,
    toggleWalletTopupModal,
    isOpenTransactionDetailSlideover,
    toggleTransactionDetailSlideover,
  }
})
