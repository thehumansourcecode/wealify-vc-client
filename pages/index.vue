<script setup lang="ts">
import { formatMoney } from '~/common/functions'
import { useDashboardStore } from '~/stores/dashboard'
import { PanelTab } from '~/types/common'

definePageMeta({
  layout: 'home',
})

const { t } = useI18n()

const dashboardStore = useDashboardStore()
const commonStore = useCommonStore()
const userStore = useUserStore()

const isShowBalance = ref(true)
function toggleBalance() {
  isShowBalance.value = !isShowBalance.value
}

onMounted(async () => {
  commonStore.setActiveTab(PanelTab.DASHBOARD)
  await Promise.all([userStore.getProfile(), userStore.getBalance()])
})

const userBalance = computed(() => userStore.userBalance)

function onClickTopup() {
  dashboardStore.toggleWalletTopupModal(true)
}

function onClickWithdraw() {
  // Todo
}
</script>
<template>
  <div class="flex flex-col overflow-y-auto pl-10 pr-[60px] flex-1">
    <div class="py-3 flex flex-row gap-3">
      <span class="text-[18px] leading-7">
        {{ t('dashboard.balance.title') }}
      </span>
      <img
        class="cursor-pointer hover:opacity-90"
        @click="toggleBalance()"
        :src="isShowBalance ? '/icons/dashboard/toggle-balance-disabled.svg' : '/icons/dashboard/toggle-balance.svg'"
        alt=""
      />
    </div>
    <div class="flex flex-row justify-between w-full mb-5">
      <!-- Balances -->
      <div class="flex flex-col gap-3 w-[45%]">
        <!-- Wealify Balance -->
        <div
          class="bg-[#1C1D23] rounded-[12px] flex flex-row pl-7 pr-12 pt-4 pb-6 justify-between gap-12 items-center bg-[url(~/assets/img/wealify-pattern.svg)] bg-no-repeat bg-right"
        >
          <div class="flex flex-col z-10">
            <span class="text-[#A5A8B8] text-14-600-20">
              {{ t('dashboard.balance.wealify.balance') }}
            </span>
            <div class="text-[18px] font-bold leading-7 mt-1">
              <span class="text-[#FFF]">{{
                isShowBalance ? formatMoney(userBalance?.wallet_balance?.balance) : '*'
              }}</span>
              <span class="pl-1 text-[#7A7D89]">USD</span>
            </div>
            <div class="pt-4 flex flex-col w-[220px] gap-2">
              <div class="flex flex-row justify-between w-full">
                <div class="flex flex-row gap-2 items-center">
                  <img src="~/assets/img/dashboard/money-in.svg" alt="" />
                  <span class="text-[#A5A8B8] text-12-500-20">
                    {{ t('dashboard.balance.wealify.moneyIn') }}
                  </span>
                </div>
                <div class="flex flex-row gap-[2px] items-center">
                  <img src="~/assets/img/dashboard/green-arrow.svg" alt="" />
                  <span class="text-[#FFF] text-xs font-semibold leading-5">
                    +{{ isShowBalance ? formatMoney(userBalance?.wallet_balance?.money_in) : '*' }} USD
                  </span>
                </div>
              </div>
              <div class="flex flex-row justify-between w-full">
                <div class="flex flex-row gap-2 items-center">
                  <img src="~/assets/img/dashboard/money-out.svg" alt="" />
                  <span class="text-[#A5A8B8] text-12-500-20">
                    {{ t('dashboard.balance.wealify.moneyOut') }}
                  </span>
                </div>
                <div class="flex flex-row gap-[2px] items-center">
                  <img src="~/assets/img/dashboard/red-arrow.svg" alt="" />
                  <span class="text-[#FFF] text-xs font-semibold leading-5">
                    -{{ isShowBalance ? formatMoney(userBalance?.wallet_balance?.money_out) : '*' }} USD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-12 justify-end">
            <div @click="onClickTopup" class="flex flex-col items-center cursor-pointer hover:opacity-90">
              <img width="40" src="~/assets/img/cards/topup.svg" alt="" />
              <span class="text-xs text-[#FFF] leading-5">
                {{ t('dashboard.balance.wealify.topup') }}
              </span>
            </div>
            <div @click="onClickWithdraw" class="flex flex-col items-center cursor-not-allowed hover:opacity-90">
              <img width="40" src="~/assets/img/cards/withdraw.svg" alt="" />
              <span class="text-xs text-[#FFF] leading-5">
                {{ t('dashboard.balance.wealify.withdraw') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card balance -->
        <div
          class="bg-[#FFF5F2] text-[#000] border border-[#E1E5EB] rounded-[12px] flex flex-row pl-7 pr-12 pt-4 pb-6 justify-between items-center bg-[url(~/assets/img/card-pattern.svg)] bg-no-repeat bg-right"
        >
          <div class="flex flex-col z-10 w-full">
            <span class="text-[#A5A8B8] text-14-600-20">
              {{ t('dashboard.balance.card.balance') }}
            </span>
            <div class="text-[18px] font-bold leading-7 mt-1">
              <span class="">{{ isShowBalance ? formatMoney(userBalance?.card_balance?.total) : '*' }}</span>
              <span class="pl-1 text-[#7A7D89]">USD</span>
            </div>
            <div class="pt-4 flex flex-col w-full gap-2">
              <div class="flex flex-row w-full">
                <div class="flex flex-row gap-2 items-center w-[130px]">
                  <img src="~/assets/img/dashboard/money-in.svg" alt="" />
                  <span class="text-[#A5A8B8] text-12-500-20">
                    {{ t('dashboard.balance.card.topup') }}
                  </span>
                </div>
                <div class="flex flex-row gap-[2px] items-center">
                  <img src="~/assets/img/dashboard/green-arrow.svg" alt="" />
                  <span class="text-xs font-semibold leading-5">
                    +{{ isShowBalance ? formatMoney(userBalance?.card_balance?.total_top_up) : '*' }} USD
                  </span>
                </div>
              </div>
              <div class="flex flex-row w-full">
                <div class="flex flex-row gap-2 items-center w-[130px]">
                  <img src="~/assets/img/dashboard/money-out.svg" alt="" />
                  <span class="text-[#A5A8B8] text-12-500-20">
                    {{ t('dashboard.balance.card.withdraw') }}
                  </span>
                </div>
                <div class="flex flex-row gap-[2px] items-center">
                  <img src="~/assets/img/dashboard/red-arrow.svg" alt="" />
                  <span class="text-xs font-semibold leading-5">
                    -{{ isShowBalance ? formatMoney(userBalance?.card_balance?.total_withdraw) : '*' }}
                    USD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="w-[45%] flex justify-end items-end">
        <img class="w-full max-h-[350px]" src="~/assets/img/dashboard/chart.svg" alt="" />
      </div>
    </div>

    <!-- Recent transactions -->
    <TransactionsRecentList />
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888888;
  }
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
  }
}
</style>
