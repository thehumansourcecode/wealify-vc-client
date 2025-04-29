<script setup lang="ts">
import { formatMoney } from '~/common/functions'
import { type ITransactionData, TransactionVCType } from '~/types/transactions'
import { formatDDMMYYYY} from '~/common/functions'
import {TransactionNetwork } from '~/types/dashboard'
const dayjs = useDayjs()

const { t } = useI18n()
const transactionStore = useTransactionStore()
const loading = computed(() => transactionStore.isLoading)
const transactionList = computed(() => transactionStore.transactionList)

const transactionTableColumns = [
  {
    key: 'type',
    label: t('transactions.list.header.type'),
    class: 'mr-5',
  },
  {
    key: 'transactionId',
    label: t('transactions.list.header.transactionId'),
    class: 'mr-5',
  },
  {
    key: 'amount',
    label: t('transactions.list.header.amount'),
    class: 'text-center mr-5 w-[150px]',
  },
  {
    key: 'currency',
    label: t('transactions.list.header.currency'),
    class: 'text-center mr-5 w-[120px]',
  },
  {
    key: 'card',
    label: t('transactions.list.header.card'),
    class: 'mr-5',
  },
  {
    key: 'created_at',
    label: t('transactions.list.header.create_date'),
    class: 'mr-5',
  },
  {
    key: 'status',
    label: t('transactions.list.header.status'),
    class: 'text-center mr-5',
  },
  {
    key: 'action',
    label: t('transactions.list.header.action'),
    class: 'text-center',
  },
]

function handleClickTransaction(row: ITransactionData) {
  if (!row) return
  transactionStore.setSelectedTransactionDetail(row)
  transactionStore.toggleTransactionDetailSlideover(true)
}

const getTransactionWallet = (network,token) => {
  switch (network){
    case TransactionNetwork.ETHEREUM:
      return `${token} (ETHEREUM)`
    case TransactionNetwork.SOLANA:
      return `${token} (SOLANA)`
    case TransactionNetwork.TRON:
      return `${token} (TRON)`
  }
}

</script>
<template>
  <div v-if="!transactionList.length" class="flex flex-col items-center justify-center gap-4 p-10 pt-0 h-full">
    <img class="min-w-[200px] min-h-[200px]" src="/images/transactions/no-transaction.svg" alt="" />
    <div class="text-14-500-20 text-[#A5A8B8]">{{ t('transactions.list.empty') }}</div>
  </div>
  <!-- Table -->
  <UTable
    v-else
    selectable
    ref="tableRef"
    :loading="loading.transactionTable"
    :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
    :rows="transactionList"
    :columns="transactionTableColumns"
    :ui="{
      default: {
        checkbox: {
          color: '[#000000]',
        },
      },

      divide: 'divide-y divide-[#D7D9E5]/0',
      tbody: 'divide-y divide-[#D7D9E5]',
      td: {
        padding: 'px-3 py-4',
      },
      checkbox: {
        padding: 'px-2 ps-4',
      },
      tr: {
        base: '',
        padding: 'px-0 py-0',
        selected: 'bg-[#F0F2F5]',
      },
      th: {
        padding: 'px-3 py-4',
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
        <img :src="`/images/transactions/${row.transaction_vc_type}.svg`" alt="" />
        <div class="flex flex-col gap-1">
          <span class="text-14-600-20 text-[#1b1c23] text-sm font-semibold font-['Manrope'] leading-tight">{{
            t(`transactions.list.type.${row.transaction_vc_type}`)
          }}</span>
          <div class='flex gap-[6px]'>
            <img
              v-if="row.crypto_wallet"
              class="cursor-pointer w-[16px] h-[16px]"
              src="/icons/common/coin_logo.png"
            />
            <span class="text-12-500-20 text-[#7A7D89]">
            {{row.virtual_card ? t(`transactions.list.card`) : row.crypto_wallet ? getTransactionWallet(row?.crypto_wallet?.network,row.confirm_transaction.raw_data.token) : t(`transactions.list.cryptoTransfer`) }}
          </span>
          </div>
        </div>
      </div>
    </template>
    <template #transactionId-data="{ row }">
      <div class="text-14-500-20 w-[160px] text-[#7A7D89]">{{ row.transaction_id }}</div>
    </template>
    <template #amount-data="{ row }">
      <div class="text-16-700-24 w-[150px] text-[#1C1D23] text-center">
        {{
          row.amount
            ? row.transaction_vc_type === TransactionVCType.TOP_UP
              ? `+${formatMoney(row?.received_amount)}`
              : `-${formatMoney(row?.received_amount)}`
            : ''
        }}
      </div>
    </template>
    <template #currency-data="{ row }">
      <div class="text-14-500-20 w-[120px] text-[#FF5524] text-center">{{ row.currency.symbol }}</div>
    </template>
    <template #card-data="{ row }">
      <div v-if="row.virtual_card" class="flex flex-row items-center gap-[14px] w-[218px]">
        <img src="/images/transactions/mastercard.svg" alt="" />
        <div class="flex flex-col gap-1">
          <span class="text-14-600-20 text-[#1C1D23]">{{ row.virtual_card.card_name }}</span>
          <span class="text-12-500-20 text-[#7A7D89]">
            {{ t(`cards.list.card_number`, { value: row.virtual_card?.last_four }) }}</span
          >
        </div>
      </div>
    </template>
    <template #created_at-data="{ row }">
      <div class="text-[#7A7D89] text-left text-14-500-20 manrope">
        {{ formatDDMMYYYY(dayjs.utc(row.created_at).local()) }}
      </div>
    </template>
    <template #status-data="{ row }">
      <div
        class="flex flex-row gap-[6px] w-[120px] items-center justify-center mx-auto px-3 py-[2px] bg-[#F0F2F5] rounded-[110px]"
        :style="{ color: getStatusColor(row?.transaction_vc_status) }"
      >
        <div class="text-12-500-20">
          {{ t(`transactions.list.status.${row.transaction_vc_status}`) }}
        </div>
        <div
          class="w-[6px] h-[6px] rounded-[1px]"
          :style="{ background: getStatusColor(row?.transaction_vc_status) }"
        ></div>
      </div>
    </template>
    <template #action-data="{ row }">
      <UButton
        @click="handleClickTransaction(row)"
        class="flex items-center py-[6px] px-4 bg-[#1C1D23] hover:bg-[#3D3E34] rounded-[6px] mx-auto"
      >
        <div class="text-12-600-20 text-white">
          {{ t('transactions.list.action.viewDetail') }}
        </div>
      </UButton>
    </template>
  </UTable>
</template>
