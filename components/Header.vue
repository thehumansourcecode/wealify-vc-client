<script setup lang="ts">
import { AUTH_DATA_STORED_KEY } from '~/common/constants'
import { formatDDMMYYYY, getTabRoute } from '~/common/functions'
import { PanelTab } from '~/types/common'

const { t } = useI18n()
const dayjs = useDayjs()

const userStore = useUserStore()
const authStore = useAuthStore()
const commonStore = useCommonStore()

const userProfile = computed(() => userStore.userProfile)
const activeTab = computed(() => commonStore.activeTab)
const isHeaderBackLayout = computed(() => commonStore.isHeaderBackLayout)
const activeChildTab = computed(() => commonStore.activeChildTab)

const hoveredTab = ref()

const lastResetDate = computed(() => '2025-03-11T13:36:41.718Z')

const links = computed(() => [
  {
    tab: 'profile',
    label: t(`common.header.profile`),
    to: '/profile',
    icon: hoveredTab.value === 'profile' ? '/icons/header/active-profile.svg' : '/icons/header/profile.svg',
  },
  {
    tab: 'reset',
    label: t(`common.header.resetPassword`),
    to: '/auth/reset',
    icon: hoveredTab.value === 'reset' ? '/icons/header/active-reset.svg' : '/icons/header/reset.svg',
    description: t('common.header.lastReset', { date: formatDDMMYYYY(dayjs.utc(lastResetDate.value).local()) }),
  },
  {
    tab: 'logout',
    label: t(`common.header.logout`),
    icon: hoveredTab.value === 'logout' ? '/icons/header/active-logout.svg' : '/icons/header/logout.svg',
    action: () => logout(),
  },
])

const items = [
  [{
    slot: 'header',
  }],
  [{
    label: 'Your Virtual Card is Ready! ',
    content:` You've added 1000 USD to your Wealify wallet. 💳 Transfer to your card now to start spending!`,
    icon: '/_nuxt/assets/img/icons/withdraw.svg',
    time_since: '2 hours ago',
    unread: true
  }, {
    label: 'Wallet Top-Up Successful! ',
    content:` You've added 1000 USD to your Wealify wallet. 💳 Transfer to your card now to start spending!`,
    icon: '/_nuxt/assets/img/icons/ready.svg',
    time_since: '2 hours ago',
  }, {
    label: 'Your Virtual Card is Ready! 🎉',
    content:`Your Wealify Card ••••2354 is now active! 🚀 \n 💳 Start making transactions now.`,
    icon: '/_nuxt/assets/img/icons/withdraw.svg',
    time_since: '2 hours ago',
  }]
]

async function logout() {
  await authStore.logout()
  navigateTo('/auth/sign-in')
}
</script>

<template>
  <div class="py-4 flex flex-row w-full justify-between items-center pl-10 pr-[60px] flex-none">
    <div v-if="!isHeaderBackLayout" class="text-[20px] leading-8">{{ t(`common.title.${activeTab}`) }}</div>
    <div v-else class="flex flex-row gap-4 items-center">
      <img
        @click="navigateTo(getTabRoute(commonStore.activeTab))"
        class="cursor-pointer hover:opacity-70"
        src="~/assets/img/icons/back.svg"
        alt=""
      />
      <div class="text-[20px] leading-8">{{ t(`common.title.${activeChildTab}`) }}</div>
    </div>
    <div class="flex flex-row items-center">
      <div class="mr-4">EN</div>
      <UDropdown :items="items"  class="sm:mx-6 mx-4 notify" :content="{align: 'end',side: 'bottom'}">
        <UButton class="w-10 h-10 p-0 rounded-full border border-[#D7D9E5] bg-[#fff] hover:bg-[#fff] flex items-center justify-center">
          <img src="~/assets/img/icons/ring.svg" />
          <span class="h-[17px] w-[27px] bg-[#FF5524] text-[10px] rounded-[48px] absolute top-[-4px] right-[-4px] leading-4">99+</span>
        </UButton>
        <template #header="{ }">
          <div class="flex justify-between w-full px-[20px] py-[14px]">
            <h2 class="font-semibold sm:text-[18px] text-[18px] leading-8 text-[#1C1D23] manrope">Notification</h2>
            <button type="button" class="flex items-center  rounded-full w-[32px] h-[32px]">
              <img src='~/assets/img/icons/read_all.svg'></img>
            </button>
          </div>
        </template>
        <template #item="{ item }">
          <div :class="{'bg-[#FFF5F2]': item.unread,'py-[12px] px-[20px] relative': true}">
            <div class="flex items-col gap-3">
              <div class="items-start flex-shrink-0 w-[44px] h-[44px] rounded-full bg-[#F0F2F5] flex items-center justify-center border-[#E5E5E5]" :class="{'!bg-[#fff] border border-[#F0F2F5]':item.unread}">
                <img :src="item.icon">
              </div>
              <div>
                <h4 class="font-semibold text-left text-[#1C1D23] mb-[4px]">{{ item.label }}</h4>
                <p class="text-left font-medium text-[12px] text-[#A5A8B8] mb-[4px]">{{ item.time_since }}</p>
                <p class="text-left font-medium text-[12px] text-[#7A7D89]">{{ item.content }}</p>
              </div>
            </div>
          </div>
        </template>
      </UDropdown>
      <UPopover mode="hover" :ui="{ background: 'bg-white', ring: 'ring-0' }">
        <div class="flex items-center justify-between">
          <img src="~/assets/img/common/avatar.svg" alt="" />
        </div>
        <template #panel>
          <div class="w-[200px] flex flex-col">
            <ULink
              v-for="link in links"
              :to="link.to"
              @click="link.action ? link.action() : null"
              @mouseover="hoveredTab = link.tab"
              @mouseout="hoveredTab = ''"
              :key="link.label"
              class="flex flex-row gap-[9px] px-3 py-[10px] cursor-pointer hover:bg-[#F0F2F5] items-center"
            >
              <img :src="link.icon" alt="" />
              <div class="flex flex-col">
                <div class="text-[#1C1D23] text-14-500-20">
                  {{ link.label }}
                </div>
                <div class="text-[#7A7D89] text-10-500-14" v-if="link.description">
                  {{ link.description }}
                </div>
              </div>
            </ULink>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
