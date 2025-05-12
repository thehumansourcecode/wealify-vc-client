<script setup lang="ts">
import { AUTH_DATA_STORED_KEY } from '~/common/constants'
import { formatDDMMYYYY, getTabRoute } from '~/common/functions'
import { PanelTab,CommonLanguage } from '~/types/common'

const { t } = useI18n()
const dayjs = useDayjs()

const countDownStore = useCountDownStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const commonStore = useCommonStore()

const profileStore = useProfileStore()
const {fetchProfile} = profileStore

const {profile} = storeToRefs(profileStore)

const activeTab = computed(() => commonStore.activeTab)
const isHeaderBackLayout = computed(() => commonStore.isHeaderBackLayout)
const activeChildTab = computed(() => commonStore.activeChildTab)
const hoveredTab = ref()
const lastResetDate = computed(() => '2025-03-11T13:36:41.718Z')
const languages = Object.values(CommonLanguage).filter((item,index)=>index !== 0)
const language = ref(languages[0])
const isShowProfile = ref(false)

// Define prop for leftPanelRef
const props = defineProps<{
  leftPanelRef: any
}>()

function toggleMobileMenu() {
  commonStore.toggleMobileMenu()
}

const showProfile = () => {
  isShowProfile.value = true
}

const links = computed(() => [
  {
    tab: 'profile',
    label: t(`common.header.profile`),
    action: () => showProfile(),
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
    icon: '/icons/header/withdraw.svg',
    time_since: '2 hours ago',
    unread: true
  }, {
    label: 'Wallet Top-Up Successful! ',
    content:` You've added 1000 USD to your Wealify wallet. 💳 Transfer to your card now to start spending!`,
    icon: '/icons/header/ready.svg',
    time_since: '2 hours ago',
  }, {
    label: 'Your Virtual Card is Ready! 🎉',
    content:`Your Wealify Card ••••2354 is now active! 🚀 \n 💳 Start making transactions now.`,
    icon: '/icons/header/withdraw.svg',
    time_since: '2 hours ago',
  }]
]

async function logout() {
  countDownStore.clear()
  await authStore.logout()
  navigateTo('/auth/sign-in')
}

onMounted(async () => {
 await fetchProfile()
})
</script>

<template>
  <div class="py-4 flex flex-row w-full justify-between items-center pl-4 md:pl-10 pr-4 md:pr-[60px] flex-none">
    <div class="flex items-center gap-1 lg:gap-4">
      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu" class="lg:hidden p-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21" stroke="#1C1D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 6H21" stroke="#1C1D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 18H21" stroke="#1C1D23" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div v-if="!isHeaderBackLayout" class="text-[16px] leading-8 lg:text-[20px]">{{ t(`common.title.${activeTab}`) }}</div>
      <div v-else class="flex-row gap-4 items-center hidden sm:flex">
        <img
          @click="navigateTo(getTabRoute(commonStore.activeTab))"
          class="cursor-pointer hover:opacity-70"
          src="~/assets/img/icons/back.svg"
          alt=""
        />
        <div class="text-[20px] leading-8">{{ t(`common.title.${activeChildTab}`) }}</div>
      </div>
    </div>
    <div class="flex flex-row items-center">
      <USelectMenu
        v-model="language"
        :options="languages"
        :selected-icon="'i-selected'"
        :ui-menu="{
          select: 'cursor-pointer',
          base: 'relative focus:outline-none overflow-y-auto max-h-[360px] scroll-py-1',
          padding: 'p-0',
          width: 'w-[max-content] min-w-full',
          option: {
            base: 'cursor-pointer text-14-500-20',
            selected: 'bg-[#F0F2F5]',
            active: 'bg-[#F0F2F5]',
            inactive: 'cursor-pointer',
            padding: 'px-1 py-1',
            rounded: 'rounded-none',
            selectedIcon: {
              base: 'h-[18px] w-[18px]',
            },
          },
          input: 'px-3 py-[10px] w-full text-[#7A7D89] icon-search font-medium text-sm leading-5 m-0 bg-white',
        }"
      >
        <template #option="{ option }">
          <div class="px-[2px] py-[2px] flex items-center justify-between w-[60px] ">
            <div class="flex flex-row gap-1">
              <img src="~/assets/img/flags/en.svg"/>
              <div class="text-center uppercase text-[#1C1D23] leading-7">
                {{ option }}
              </div>
            </div>
          </div>
        </template>
        <template #default="{}">
          <div class="px-[2px] py-[2px] rounded-[50px] bg-[#F0F2F5] flex items-center justify-between w-[58px] ">
            <div class="flex flex-row gap-1 items-center">
              <div class="flex flex-row gap-1">
                <img src="~/assets/img/flags/en.svg"/>
                <div class="flex flex-col gap-1 text-[#1C1D23] leading-7">
                  <div class="text-center uppercase">
                    {{ language }}
                  </div>
              </div>
            </div>
          </div>
          </div>
        </template>
      </USelectMenu>
      <UDropdown :items="items"  class="lg:mr-7 lg:mr-4 mr-2 ml-2 notify" :content="{align: 'end',side: 'bottom'}">
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

      <UPopover mode="click" :ui="{ background: 'bg-white', ring: 'ring-0' }">
        <div class="flex items-center justify-between w-[110px] lg:w-auto">
          <UTooltip
                class="ml-1"
                :text="profile?.email"
                :popper="{ arrow: true, placement: 'top' }"
                :ui="{
                  background: 'bg-[#1C1D23]',
                  width: 'max-w-[252px]',
                  color: 'text-[#FFF]',
                  base: 'px-3 py-2 h-[max-content]  text-xs font-medium text-clip text-center',
                  ring: 'ring-0',
                  arrow: { background: 'before:bg-[#1C1D23]' },
                }"
              >
              <img src="~/assets/img/common/avatar.svg"/>
              </UTooltip>
          <div class="font-semibold mb-1.5 text-[#17171E] ml-[9px] max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap" :title="profile?.full_name">{{profile?.full_name}} </div>
          <UButton  class="w-[20px h-[20px] ml-[6px] p-0 flex items-center justify-center shadow-none bg-white hover:bg-white">
            <img src="/assets/img/icons/dropdown.svg"/>
          </UButton>
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

    <ProfileModal v-model="isShowProfile" />
  </div>
</template>

<style lang="scss" scoped>
</style>
