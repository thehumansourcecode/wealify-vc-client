import { commonService } from '~/services/common.service'
import { CardStatus, type CardCategory } from '~/types/cards'
import { CommonCurrency, FeeType, PanelChildTab, PanelTab, type IDropdownCardData } from '~/types/common'

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

  const categoryList = ref<CardCategory[]>([])

  async function getDropdownCategoryList() {
    const response = await commonService.getDropdownCategoryList()
    if (response.success) {
      categoryList.value = response.data as CardCategory[]
    }
    return response
  }

  const dropdownCardList = ref<IDropdownCardData[]>()

  async function getDropdownCardList() {
    const response = await commonService.getDropdownCardList({ card_status: [CardStatus.ACTIVE] })
    if (response.success) {
      dropdownCardList.value = response.data as IDropdownCardData[]
    }
    return response
  }

  async function getFeeByType(type: FeeType) {
    const response = await commonService.getFeeByType(type)
    return response
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
    categoryList,
    getDropdownCategoryList,
    dropdownCardList,
    getDropdownCardList,
    getFeeByType,
  }
})
