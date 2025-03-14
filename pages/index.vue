<script setup lang="ts">
import { formatMoney } from '~/common/functions'
import { useDashboardStore } from '~/stores/dashboard'
import { CommonCurrency, PanelTab } from '~/types/common'
import { type ITransactionData, TransactionMethod, TransactionStatus, TransactionType } from '~/types/dashboard'

definePageMeta({
  layout: 'home',
})

const { t } = useI18n()

const dashboardStore = useDashboardStore()

const isShowBalance = ref(true)
function toggleBalance() {
  isShowBalance.value = !isShowBalance.value
}

const commonStore = useCommonStore()

onMounted(() => {
  commonStore.setActiveTab(PanelTab.DASHBOARD)
})

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
    type: {
      label: TransactionType.TOPUP,
      method: TransactionMethod.USDT,
    },
    transactionId: 'T124513143726134',
    amount: 100000000,
    currency: CommonCurrency.USD,
    card: null, // USDT top-up, no card used
    status: TransactionStatus.SUCCESS,
  },
  {
    type: {
      label: TransactionType.PAYMENT,
      method: TransactionMethod.CARD,
    },
    transactionId: 'S124513143726134',
    amount: 1000,
    currency: CommonCurrency.USD,
    card: {
      cardName: 'Nguyen Hong Ngoc',
      cardNumber: 'xxxx xxxx xxxx 1232',
    },
    status: TransactionStatus.PROCESSING,
  },
  {
    type: {
      label: TransactionType.WITHDRAW,
      method: TransactionMethod.USDT,
    },
    transactionId: 'T124513143726134',
    amount: 1000,
    currency: CommonCurrency.USD,
    card: null, // USDT withdraw, no card used
    status: TransactionStatus.FAILED,
  },
  {
    type: {
      label: TransactionType.PAYMENT,
      method: TransactionMethod.CARD,
    },
    transactionId: 'T124513143726134',
    amount: 1000,
    currency: CommonCurrency.USD,
    card: {
      cardName: 'Nguyen Hong Ngoc',
      cardNumber: 'xxxx xxxx xxxx 1232',
    },
    status: TransactionStatus.PROCESSING,
  },
  {
    type: {
      label: TransactionType.PAYMENT,
      method: TransactionMethod.CARD,
    },
    transactionId: 'T124513143726134',
    amount: 1000,
    currency: CommonCurrency.USD,
    card: {
      cardName: 'Nguyen Hong Ngoc',
      cardNumber: 'xxxx xxxx xxxx 1232',
    },
    status: TransactionStatus.PROCESSING,
  },
])

const transactionTableColumns = [
  {
    key: 'type',
    label: t('dashboard.transactions.table.header.type'),
    class: 'mr-5',
  },
  {
    key: 'transactionId',
    label: t('dashboard.transactions.table.header.transactionId'),
    class: 'mr-5',
  },
  {
    key: 'amount',
    label: t('dashboard.transactions.table.header.amount'),
    class: 'text-center mr-5 w-[150px]',
  },
  {
    key: 'currency',
    label: t('dashboard.transactions.table.header.currency'),
    class: 'text-center mr-5 w-[120px]',
  },
  {
    key: 'card',
    label: t('dashboard.transactions.table.header.card'),
    class: 'mr-5',
  },
  {
    key: 'status',
    label: t('dashboard.transactions.table.header.status'),
    class: 'text-center mr-5',
  },
  {
    key: 'action',
    label: t('dashboard.transactions.table.header.action'),
    class: 'text-center',
  },
]

function getStatusColor(status: TransactionStatus) {
  if (status === TransactionStatus.FAILED) {
    return '#ED2C38'
  }
  if (status === TransactionStatus.SUCCESS) {
    return '#2EA518'
  }
  if (status === TransactionStatus.PROCESSING) {
    return '#02076F'
  }
}

function onClickTopup() {
  dashboardStore.toggleTopupModal(true)
}

function onClickWithdraw() {
  // Todo
}

async function onClickViewDetail() {
  // await call API
  dashboardStore.toggleTransactionDetailSlideover(true)
}
</script>
<template>
  <div class="flex flex-col overflow-y-auto pl-10 pr-[60px]">
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
            <span class="text-[#A5A8B8] text-sm-600-20">
              {{ t('dashboard.balance.wealify.balance') }}
            </span>
            <div class="text-[18px] font-bold leading-7 mt-1">
              <span class="text-[#FFF]">{{ isShowBalance ? wealifyBalance.balance : '*' }}</span>
              <span class="pl-1 text-[#7A7D89]">USD</span>
            </div>
            <div class="pt-4 flex flex-col w-[220px] gap-2">
              <div class="flex flex-row justify-between w-full">
                <div class="flex flex-row gap-2 items-center">
                  <img src="~/assets/img/dashboard/money-in.svg" alt="" />
                  <span class="text-[#A5A8B8] text-xs-500-20">
                    {{ t('dashboard.balance.wealify.moneyIn') }}
                  </span>
                </div>
                <div class="flex flex-row gap-[2px] items-center">
                  <img src="~/assets/img/dashboard/green-arrow.svg" alt="" />
                  <span class="text-[#FFF] text-xs font-semibold leading-5">
                    +{{ isShowBalance ? wealifyBalance.moneyIn : '*' }} USD
                  </span>
                </div>
              </div>
              <div class="flex flex-row justify-between w-full">
                <div class="flex flex-row gap-2 items-center">
                  <img src="~/assets/img/dashboard/money-out.svg" alt="" />
                  <span class="text-[#A5A8B8] text-xs-500-20">
                    {{ t('dashboard.balance.wealify.moneyOut') }}
                  </span>
                </div>
                <div class="flex flex-row gap-[2px] items-center">
                  <img src="~/assets/img/dashboard/red-arrow.svg" alt="" />
                  <span class="text-[#FFF] text-xs font-semibold leading-5">
                    -{{ isShowBalance ? wealifyBalance.moneyOut : '*' }} USD
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-12 justify-end">
            <div @click="onClickTopup" class="flex flex-col items-center cursor-pointer hover:opacity-90">
              <img width="40" src="~/assets/img/dashboard/topup.svg" alt="" />
              <span class="text-xs text-[#FFF] leading-5">
                {{ t('dashboard.balance.wealify.topup') }}
              </span>
            </div>
            <div @click="onClickWithdraw" class="flex flex-col items-center cursor-not-allowed hover:opacity-90">
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
            <span class="text-[#A5A8B8] text-sm-600-20">
              {{ t('dashboard.balance.card.balance') }}
            </span>
            <div class="text-[18px] font-bold leading-7 mt-1">
              <span class="">{{ isShowBalance ? cardBalance.balance : '*' }}</span>
              <span class="pl-1 text-[#7A7D89]">USD</span>
            </div>
            <div class="pt-4 flex flex-col w-[220px] gap-2">
              <div class="flex flex-row justify-between w-full">
                <div class="flex flex-row gap-2 items-center">
                  <img src="~/assets/img/dashboard/money-in.svg" alt="" />
                  <span class="text-[#A5A8B8] text-xs-500-20">
                    {{ t('dashboard.balance.card.topup') }}
                  </span>
                </div>
                <div class="flex flex-row gap-[2px] items-center">
                  <img src="~/assets/img/dashboard/green-arrow.svg" alt="" />
                  <span class="text-xs font-semibold leading-5">
                    +{{ isShowBalance ? cardBalance.topup : '*' }} USD
                  </span>
                </div>
              </div>
              <div class="flex flex-row justify-between w-full">
                <div class="flex flex-row gap-2 items-center">
                  <img src="~/assets/img/dashboard/money-out.svg" alt="" />
                  <span class="text-[#A5A8B8] text-xs-500-20">
                    {{ t('dashboard.balance.card.withdraw') }}
                  </span>
                </div>
                <div class="flex flex-row gap-[2px] items-center">
                  <img src="~/assets/img/dashboard/red-arrow.svg" alt="" />
                  <span class="text-xs font-semibold leading-5">
                    -{{ isShowBalance ? cardBalance.withdraw : '*' }} USD
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
    <div class="rounded-[12px] flex flex-col border border-[#D7D9E5] mb-8">
      <div class="px-5 flex flex-row justify-between items-center pt-3 pb-5">
        <span class="text-[#1C1D23] text-[18px] font-semibold leading-7">
          {{ t('dashboard.transactions.title') }}
        </span>
        <ULink to="/transactions">
          <UButton
            class="flex items-center justify-center rounded-[110px] bg-[#F0F2F5] hover:bg-[#E1E3E6] text-black text-sm-600-20 px-4 py-2"
          >
            {{ t('dashboard.transactions.viewAll') }}
          </UButton>
        </ULink>
      </div>
      <!-- Table -->
      <UTable
        v-if="recentTransactions?.length"
        :rows="recentTransactions"
        :columns="transactionTableColumns"
        :ui="{
          divide: 'divide-y divide-[#D7D9E5]/0',
          tbody: 'divide-y divide-[#D7D9E5] max-h-[400px]',
          td: {
            padding: 'px-5 py-4',
          },
          tr: {
            base: 'cursor-pointer',
            padding: 'px-0 py-0',
          },
          th: {
            padding: 'px-5 py-4',
          },
          thead: 'bg-[#FFEEE9]',
          emptyState: {
            label: 'text-md text-center',
            icon: '',
          },
        }"
        class="table-wrapper grow"
      >
        <template #type-data="{ row }">
          <div class="flex flex-row items-center gap-[14px] w-[165px]">
            <img :src="`/icons/dashboard/${row.type.label}.svg`" alt="" />
            <div class="flex flex-col gap-1">
              <span class="text-sm-600-20">{{ t(`dashboard.transactions.table.type.${row.type.label}`) }}</span>
              <span class="text-xs-500-20 text-[#7A7D89]">{{
                t(`dashboard.transactions.table.type.${row.type.method}`)
              }}</span>
            </div>
          </div>
        </template>
        <template #transactionId-data="{ row }">
          <div class="text-sm-500-20 w-[160px] text-[#7A7D89]">{{ row.transactionId }}</div>
        </template>
        <template #amount-data="{ row }">
          <div class="text-md-700-24 w-[150px] text-[#1C1D23] text-center">
            {{
              row.amount
                ? row.type.label === TransactionType.TOPUP
                  ? `+${formatMoney(row.amount)}`
                  : `-${formatMoney(row.amount)}`
                : ''
            }}
          </div>
        </template>
        <template #currency-data="{ row }">
          <div class="text-sm-500-20 w-[120px] text-[#FF5524] text-center">{{ row.currency }}</div>
        </template>
        <template #card-data="{ row }">
          <div class="flex flex-row items-center gap-[14px] w-[218px]">
            <img src="/icons/dashboard/mastercard.svg" alt="" />
            <div class="flex flex-col gap-1">
              <span class="text-sm-600-20">{{ row.card?.cardName }}</span>
              <span class="text-xs-500-20 text-[#7A7D89]"> {{ row.card?.cardNumber }}</span>
            </div>
          </div>
        </template>
        <template #status-data="{ row }">
          <div
            class="flex flex-row gap-[6px] w-[120px] items-center justify-center mx-auto px-3 py-[2px] bg-[#F0F2F5] rounded-[110px]"
            :style="{ color: getStatusColor(row?.status) }"
          >
            <div class="text-xs-500-20">
              {{ t(`dashboard.transactions.table.status.${row.status}`) }}
            </div>
            <div class="w-[6px] h-[6px] rounded-[1px]" :style="{ background: getStatusColor(row?.status) }"></div>
          </div>
        </template>
        <template #action-data="{ row }">
          <UButton
            @click="onClickViewDetail"
            class="flex items-center py-[6px] px-4 bg-[#1C1D23] hover:bg-[#3D3E34] rounded-[6px] mx-auto"
          >
            <div class="text-xs-600-20 text-white">
              {{ t('dashboard.transactions.table.action.viewDetail') }}
            </div>
          </UButton>
        </template>
      </UTable>
      <div v-else class="flex flex-col items-center justify-center gap-4 h-full">
        <img src="~/assets/img/dashboard/no-transaction.svg" alt="" />
        <div class="text-sm-500-20 text-[#A5A8B8]">{{ t('dashboard.transactions.table.empty') }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-wrapper {
  height: fit-content;
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
