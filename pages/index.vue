<script setup lang="ts">
import { CommonCurrency } from '~/types/common'
import { ITransactionData, TransactionStatus, TransactionType } from '~/types/dashboard'

definePageMeta({
  layout: 'home',
})

const { t } = useI18n()

const isShowBalance = ref(true)
function toggleBalance() {
  isShowBalance.value = !isShowBalance.value
}

const wealifyBalance = ref({
  balance: 0,
  moneyIn: 0,
  moneyOut: 0,
})

const cardBalance = ref({
  balance: 0,
  topup: 0,
  withdraw: 0,
})

const recentTransactions = computed<ITransactionData[]>(() => [
  {
    type: TransactionType.TOPUP,
    transactionId: 'T124513143726134',
    amount: 1000,
    currency: CommonCurrency.USD,
    card: null, // USDT top-up, no card used
    status: TransactionStatus.SUCCESS,
  },
  {
    type: TransactionType.PAYMENT,
    transactionId: 'S124513143726134',
    amount: -1000,
    currency: CommonCurrency.USD,
    card: {
      cardName: 'Nguyen Hong Ngoc',
      cardNumber: 'xxxx xxxx xxxx 1232',
    },
    status: TransactionStatus.PROCESSING,
  },
  {
    type: TransactionType.WITHDRAW,
    transactionId: 'T124513143726134',
    amount: 1000,
    currency: CommonCurrency.USD,
    card: null, // USDT withdraw, no card used
    status: TransactionStatus.FAILED,
  },
  {
    type: TransactionType.PAYMENT,
    transactionId: 'T124513143726134',
    amount: -1000,
    currency: CommonCurrency.USD,
    card: {
      cardName: 'Nguyen Hong Ngoc',
      cardNumber: 'xxxx xxxx xxxx 1232',
    },
    status: TransactionStatus.PROCESSING,
  },
  {
    type: TransactionType.TOPUP,
    transactionId: 'T124513143726134',
    amount: 1000,
    currency: CommonCurrency.USD,
    card: {
      cardName: 'Nguyen Hong Ngoc',
      cardNumber: 'xxxx xxxx xxxx 1232',
    },
    status: TransactionStatus.SUCCESS,
  },
])
</script>
<template>
  <div class="py-3 flex flex-row gap-3">
    <span class="text-[18px] leading-7">
      {{ t('dashboard.balance.title') }}
    </span>
    <img
      class="cursor-pointer hover:opacity-90"
      @click="toggleBalance()"
      src="~/assets/img/dashboard/toggle-balance.svg"
      alt=""
    />
  </div>
  <div class="flex flex-row justify-between w-full">
    <!-- Balances -->
    <div class="flex flex-col gap-3 w-[45%]">
      <!-- Wealify Balance -->
      <div
        class="bg-[#1C1D23] rounded-[12px] flex flex-row pl-7 pr-12 pt-4 pb-6 justify-between gap-12 items-center bg-[url(~/assets/img/wealify-pattern.svg)] bg-no-repeat bg-right"
      >
        <div class="flex flex-col z-10">
          <span class="text-[#A5A8B8] text-sm font-medium leading-5">
            {{ t('dashboard.balance.wealify.balance') }}
          </span>
          <div class="text-[18px] font-bold leading-7 mt-1">
            <span class="text-[#FFF]">{{ wealifyBalance.balance }}</span>
            <span class="pl-1 text-[#7A7D89]">USD</span>
          </div>
          <div class="pt-4 flex flex-col w-[220px] gap-2">
            <div class="flex flex-row justify-between w-full">
              <div class="flex flex-row gap-2 items-center">
                <img src="~/assets/img/dashboard/money-in.svg" alt="" />
                <span class="text-[#A5A8B8] text-xs font-medium leading-5">
                  {{ t('dashboard.balance.wealify.moneyIn') }}
                </span>
              </div>
              <div class="flex flex-row gap-[2px] items-center">
                <img src="~/assets/img/dashboard/green-arrow.svg" alt="" />
                <span class="text-[#FFF] text-xs font-semibold leading-5"> +{{ wealifyBalance.moneyIn }} USD </span>
              </div>
            </div>
            <div class="flex flex-row justify-between w-full">
              <div class="flex flex-row gap-2 items-center">
                <img src="~/assets/img/dashboard/money-out.svg" alt="" />
                <span class="text-[#A5A8B8] text-xs font-medium leading-5">
                  {{ t('dashboard.balance.wealify.moneyOut') }}
                </span>
              </div>
              <div class="flex flex-row gap-[2px] items-center">
                <img src="~/assets/img/dashboard/red-arrow.svg" alt="" />
                <span class="text-[#FFF] text-xs font-semibold leading-5"> -{{ wealifyBalance.moneyOut }} USD </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-12 justify-end">
          <div class="flex flex-col items-center cursor-pointer hover:opacity-90">
            <img width="40" src="~/assets/img/dashboard/topup.svg" alt="" />
            <span class="text-xs text-[#FFF] leading-5">
              {{ t('dashboard.balance.wealify.topup') }}
            </span>
          </div>
          <div class="flex flex-col items-center cursor-pointer hover:opacity-90">
            <img width="40" src="~/assets/img/dashboard/withdraw.svg" alt="" />
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
        <div class="flex flex-col z-10">
          <span class="text-[#A5A8B8] text-sm font-medium leading-5">
            {{ t('dashboard.balance.card.balance') }}
          </span>
          <div class="text-[18px] font-bold leading-7 mt-1">
            <span class="">{{ cardBalance.balance }}</span>
            <span class="pl-1 text-[#7A7D89]">USD</span>
          </div>
          <div class="pt-4 flex flex-col w-[220px] gap-2">
            <div class="flex flex-row justify-between w-full">
              <div class="flex flex-row gap-2 items-center">
                <img src="~/assets/img/dashboard/money-in.svg" alt="" />
                <span class="text-[#A5A8B8] text-xs font-medium leading-5">
                  {{ t('dashboard.balance.card.topup') }}
                </span>
              </div>
              <div class="flex flex-row gap-[2px] items-center">
                <img src="~/assets/img/dashboard/green-arrow.svg" alt="" />
                <span class="text-xs font-semibold leading-5"> +{{ cardBalance.topup }} USD </span>
              </div>
            </div>
            <div class="flex flex-row justify-between w-full">
              <div class="flex flex-row gap-2 items-center">
                <img src="~/assets/img/dashboard/money-out.svg" alt="" />
                <span class="text-[#A5A8B8] text-xs font-medium leading-5">
                  {{ t('dashboard.balance.card.withdraw') }}
                </span>
              </div>
              <div class="flex flex-row gap-[2px] items-center">
                <img src="~/assets/img/dashboard/red-arrow.svg" alt="" />
                <span class="text-xs font-semibold leading-5"> -{{ cardBalance.withdraw }} USD </span>
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
  <div></div>
</template>
