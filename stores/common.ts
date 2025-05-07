import { commonService } from '~/services/common.service'
import { CardStatus, type CardCategory } from '~/types/cards'
import {
  CommonCurrency,
  FeeType,
  PanelChildTab,
  PanelTab,
  type Fees,
  type IDropdownCardData,
  type IFeeData,
} from '~/types/common'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  state: () => ({
    activeTab: PanelTab.DASHBOARD,
    activeChildTab: '',
    isHeaderBackLayout: false,
    isMobileMenuOpen: false,
    categoryList: [] as CardCategory[],
    feeList: {} as Fees
  }),
  actions: {
    setActiveTab(tab: PanelTab) {
      this.activeTab = tab
    },
    setActiveChildTab(tab: string) {
      this.activeChildTab = tab
    },
    setHeaderBackLayout(isBack: boolean) {
      this.isHeaderBackLayout = isBack
    },
    toggleMobileMenu(isOpen?: boolean) {
      if (typeof isOpen === 'boolean') {
        this.isMobileMenuOpen = isOpen
      } else {
        this.isMobileMenuOpen = !this.isMobileMenuOpen
      }
    },
    async getDropdownCategoryList() {
      const response = await commonService.getDropdownCategoryList()
      if (response.success) {
        this.categoryList = response.data.items
      }
      return response
    },
    async getFee(type?: FeeType) {
      const response = await commonService.getFee(type)
      if (response.success) {
        this.feeList = response.data
      }
      return response
    }
  },
})
