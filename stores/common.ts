import { CommonCurrency, PanelChildTab, PanelTab } from '~/types/common'

export const useCommonStore = defineStore('common', () => {
  const config = useRuntimeConfig()
  const { t } = useI18n()

  const loading = ref(false)

  function setLoading(state: boolean) {
    loading.value = state
  }

  // Move to local storage
  const currency = ref<CommonCurrency>(CommonCurrency.USD)

  function setCurrency(c: CommonCurrency) {
    currency.value = c
  }

  const activeTab = ref<PanelTab>(PanelTab.DASHBOARD)

  function setActiveTab(tab: PanelTab) {
    activeTab.value = tab
  }

  const activeChildTab = ref<PanelChildTab>()

  function setActiveChildTab(tab: PanelChildTab | undefined) {
    activeChildTab.value = tab
  }

  const isHeaderBackLayout = ref(false)

  function setHeaderBackLayout(state: boolean) {
    isHeaderBackLayout.value = state
  }

  return {
    config,
    loading,
    setLoading,
    currency,
    setCurrency,
    activeTab,
    setActiveTab,
    isHeaderBackLayout,
    setHeaderBackLayout,
    activeChildTab,
    setActiveChildTab,
  }
})
