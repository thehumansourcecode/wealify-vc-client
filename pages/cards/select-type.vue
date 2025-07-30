<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Card selection -->
    <div class="flex-1 flex justify-center mt-[140px]">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[72px]">
        <div class="flex flex-col items-center max-w-[360px]">
          <img src="/assets/img/cards/banner-card-1.png" class="mb-6" />
          <h2 class="text-center text-[#1C1D23] font-manrope text-[20px] font-semibold leading-[32px] mb-[6px]">
            The best card for purchases
          </h2>
          <p class="text-center text-[#7A7D89] font-manrope text-[14px] font-medium leading-[20px] mb-6">
            Choose a card for individual purchases either make online or in person
          </p>
          <button
            class="bg-[#A5A8B8] text-[#D7D9E5] text-base font-semibold leading-5 px-4 py-3 w-[180px] rounded-[49px] cursor-not-allowed"
            disabled
          >
            Comming soon
          </button>
        </div>
        <div class="flex flex-col items-center max-w-[360px]">
          <img src="/assets/img/cards/banner-card-2.png" class="mb-6" />
          <h2 class="text-center text-[#1C1D23] font-manrope text-[20px] font-semibold leading-[32px] mb-[6px]">
            To pay for advertising
          </h2>
          <p class="text-center text-[#7A7D89] font-manrope text-[14px] font-medium leading-[20px] mb-6">
            Choose a card to advertise on Facebook, Google, TikTok or any other platform
          </p>
          <button
            class="bg-[#1C1D23] text-white text-base font-semibold leading-5 px-4 py-3 w-[180px] rounded-[49px] hover:bg-gray-800 transition"
            @click="goToIssue"
          >
            Issue a card
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PanelChildTab, PanelTab } from '~/types/common'

definePageMeta({ layout: 'home' })

const goToIssue = () => {
  const router = useRouter()
  router.push('/cards/issue')
}

const commonStore = useCommonStore()

onMounted(async () => {
  commonStore.setHeaderBackLayout(true)
  commonStore.setActiveTab(PanelTab.CARD_LIST)
  commonStore.setActiveChildTab(PanelChildTab.CARD_TYPE_SELECT)
})
</script>
