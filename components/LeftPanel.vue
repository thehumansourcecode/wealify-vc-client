<script setup lang="ts">
import { PanelTab } from '~/types/common'
import { ProfileTab } from '~/types/user'

const userStore = useUserStore()
const authStore = useAuthStore()
const commonStore = useCommonStore()

const { t } = useI18n()

const userProfile = computed(() => userStore.userProfile)

const activeTab = computed(() => commonStore.activeTab)
const {isMobileMenuOpen} = storeToRefs(commonStore)

function setActiveTab(tab: PanelTab) {
  commonStore.setActiveTab(tab)
}

const route = useRoute()

const links = computed(() => [
  {
    value: PanelTab.DASHBOARD,
    label: t(`common.title.${PanelTab.DASHBOARD}`),
    to: '/',
    active: activeTab.value === PanelTab.DASHBOARD,
    icon: activeTab.value === PanelTab.DASHBOARD ? '/icons/left-panel/dashboard-active.svg' : '/icons/left-panel/dashboard.svg',
  },
  {
    value: PanelTab.CARD_LIST,
    label: t(`common.title.${PanelTab.CARD_LIST}`),
    to: '/cards',
    active: activeTab.value === PanelTab.CARD_LIST,
    icon: activeTab.value === PanelTab.CARD_LIST ? '/icons/left-panel/cards-active.svg' : '/icons/left-panel/cards.svg',
  },
  {
    value: PanelTab.TRANSACTIONS,
    label: t(`common.title.${PanelTab.TRANSACTIONS}`),
    to: '/transactions',
    active: activeTab.value === PanelTab.TRANSACTIONS,
    icon: activeTab.value === PanelTab.TRANSACTIONS ? '/icons/left-panel/transactions-active.svg' : '/icons/left-panel/transactions.svg',
  },
  {
    value: PanelTab.SETTINGS,
    label: t(`common.title.${PanelTab.SETTINGS}`),
    to: '/settings',
    active: activeTab.value === PanelTab.SETTINGS,
    icon: activeTab.value === PanelTab.SETTINGS ? '/icons/left-panel/settings-active.svg' : '/icons/left-panel/settings.svg',
  },
  {
    value: PanelTab.HELP,
    label: t(`common.title.${PanelTab.HELP}`),
    to: '/help',
    active: activeTab.value === PanelTab.HELP,
    icon: activeTab.value === PanelTab.HELP ? '/icons/left-panel/help-active.svg' : '/icons/left-panel/help.svg',
  },
  {
    value: PanelTab.CONTACT_SUPPORT,
    label: t(`common.title.${PanelTab.CONTACT_SUPPORT}`),
    to: '/support',
    active: activeTab.value === PanelTab.CONTACT_SUPPORT,
    icon: activeTab.value === PanelTab.CONTACT_SUPPORT ? '/icons/left-panel/support-active.svg' : '/icons/left-panel/support.svg',
  },
])

onMounted(() => {
  const path = route.path
  const tab = links.value.find(link => link.to === path)
  if (tab) {
    setActiveTab(tab.value)
  }
})
</script>

<template>
  <div class="hidden lg:block px-4 w-[24%] max-w-[250px] min-w-[250px]">
    <div class="pt-5 pb-8">
      <ULink to="/"><img src="~/assets/img/logo/logo.svg" alt="" /></ULink>
    </div>
    <div class="flex flex-col gap-1">
      <div
        v-for="link in links"
        :key="link.to"
        class="w-full relative hover:bg-[#F0F2F5] rounded-[6px] border-l"
        :class="link.active ? 'bg-[#F0F2F5] border-[#FF5524]' : 'border-transparent'"
        @click="setActiveTab(link.value)"
      >
        <ULink :to="link.to">
          <div class="flex flex-row">
            <img class="mx-2" :src="link.icon" alt="" />
            <div class="relative py-[10px] cursor-pointer relative" :class="link.active ? 'text-common' : 'text-pale'">
              {{ link.label }}
            </div>
          </div>
        </ULink>
      </div>
    </div>
  </div>

  <!-- Mobile Sidebar -->
  <div class="lg:hidden fixed inset-0 z-50" v-show="isMobileMenuOpen">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/50" @click="commonStore.toggleMobileMenu(false)"></div>

    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 w-[250px] bg-white transform transition-transform duration-300 ease-in-out" 
         :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="px-4">
        <div class="pt-5 pb-8 flex justify-between items-center">
          <ULink to="/"><img src="~/assets/img/logo/logo.svg" alt="" /></ULink>
          <button @click="commonStore.toggleMobileMenu(false)" class="p-2">
            <img src="~/assets/img/common/close.svg" alt="Close" />
          </button>
        </div>
        <div class="flex flex-col gap-1">
          <div
            v-for="link in links"
            :key="link.to"
            class="w-full relative hover:bg-[#F0F2F5] rounded-[6px] border-l"
            :class="link.active ? 'bg-[#F0F2F5] border-[#FF5524]' : 'border-transparent'"
            @click="setActiveTab(link.value); commonStore.toggleMobileMenu(false)"
          >
            <ULink :to="link.to">
              <div class="flex flex-row">
                <img class="mx-2" :src="link.icon" alt="" />
                <div class="relative py-[10px] cursor-pointer relative" :class="link.active ? 'text-common' : 'text-pale'">
                  {{ link.label }}
                </div>
              </div>
            </ULink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Add transition for mobile sidebar
.lg\:hidden {
  .fixed {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
