<script setup lang="ts">
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
    action: logout,
  },
])

function logout() {
  authStore.logout()
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
      <div class="mr-7">noti</div>
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
.gradient {
  background: linear-gradient(to right, #eee, #cda981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
