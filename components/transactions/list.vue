<script setup lang="ts">
import { formatMoney } from '~/common/functions'
import { type ITransactionData, TransactionVCType } from '~/types/transactions'
import { formatDDMMYYYY} from '~/common/functions'
import {TransactionNetwork } from '~/types/dashboard'
const dayjs = useDayjs()
import { TransactionDetailType, } from '~/types/transactions'

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

const getCoinLogo = (network:string ,token :string) => {
  return `/icons/common/${token}_${network}.png`
}

</script>
<template>
    <div v-if="!transactionList.length" class="flex flex-col items-center justify-center gap-4 p-4 md:p-10 pt-0 h-full">
      <img class="min-w-[150px] md:min-w-[200px] min-h-[150px] md:min-h-[200px]" src="/images/transactions/no-transaction.svg" alt="" />
      <div class="text-14-500-20 text-[#A5A8B8] text-center">{{ t('transactions.list.empty') }}</div>
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
          padding: 'px-1.5 md:px-3 py-1.5 md:py-4',
        },
        checkbox: {
          padding: 'px-1.5 ps-1.5 md:ps-4',
        },
        tr: {
          base: '',
          padding: 'px-0 py-0',
          selected: 'bg-[#F0F2F5]',
        },
        th: {
          padding: 'px-1.5 md:px-3 py-1.5 md:py-4',
          base: 'text-12 md:text-14-500-20 text-[#7A7D89]',
        },
        thead: 'bg-[#FFEEE9]',
        emptyState: {
          label: 'text-md text-center',
          icon: '',
        },
      }"
      class="table-wrapper grow overflow-x-auto"
    >
      <template #type-data="{ row }">
        <div class="flex flex-row items-center gap-2 md:gap-[14px] w-[165px] min-w-[140px]">
          <img :src="`/images/transactions/${row.transaction_vc_type}.svg`" alt="" class="w-6 h-6 md:w-auto md:h-auto" />
          <div class="flex flex-col gap-0.5 md:gap-1">
            <span class="text-12 md:text-14-600-20 text-[#1b1c23] text-sm font-semibold font-['Manrope'] leading-tight">{{
              t(`transactions.list.type.${row.transaction_vc_type}`)
            }}</span>
            <div class='flex gap-1 md:gap-[6px]'>
              <img
                v-if="row.crypto_wallet"
                class="cursor-pointer w-[16px] h-[16px]"
                :src="getCoinLogo(row.crypto_wallet?.network,row.confirm_transaction?.raw_data?.token)"
              />
              <span class="text-[10px] lg:text-[12px] leading-[20px] font-medium text-[#7A7D89]">
              {{
                  row.virtual_card ?
                    row.vc_detail_transaction_type == TransactionDetailType.WALLET_REFUND ||
                    row.vc_detail_transaction_type == TransactionDetailType.WALLET_WITHDRAW ||
                    row.vc_detail_transaction_type == TransactionDetailType.WALLET_ISSUE_WITHDRAW
                    ? t(`transactions.list.wallet`) : t(`transactions.list.card`) :
                  row.crypto_wallet ?
                  getTransactionWallet(row.crypto_wallet?.network,row.confirm_transaction?.raw_data?.token) :
                  t(`transactions.list.wallet`) }}
            </span>
            </div>
          </div>
        </div>
      </template>
      <template #transactionId-data="{ row }">
        <div class="text-12 md:text-14-500-20 w-[160px] min-w-[120px] text-[#7A7D89]">{{ row.transaction_id }}</div>
      </template>
      <template #amount-data="{ row }">
        <div class="text-14 md:text-16-700-24 w-[150px] min-w-[100px] text-[#1C1D23] text-center">
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
        <div class="text-14-500-20 w-[120px] min-w-[80px] text-[#FF5524] text-center">{{ row.currency?.symbol }}</div>
      </template>
      <template #card-data="{ row }">
        <div v-if="row.virtual_card" class="flex flex-row items-center gap-2 md:gap-[14px] w-[218px] min-w-[160px]">
          <img src="/images/transactions/mastercard.svg" alt="" class="w-6 h-6 md:w-auto md:h-auto" />
          <div class="flex flex-col gap-0.5 md:gap-1">
            <span class="text-14-600-20 text-[#1C1D23]">{{ row.virtual_card.card_name }}</span>
            <span class="text-[10px] lg:text-[12px] leading-[20px] font-medium text-[#7A7D89]">
              {{ t(`cards.list.card_number`, { value: row.virtual_card?.last_four }) }}</span
            >
          </div>
        </div>
      </template>
      <template #created_at-data="{ row }">
        <div class="text-12 md:text-14-500-20 text-[#7A7D89] text-left manrope">
          {{ formatDDMMYYYY(dayjs.utc(row.created_at).local()) }}
        </div>
      </template>
      <template #status-data="{ row }">
        <div
          class="flex flex-row gap-1 md:gap-[6px] w-[120px] min-w-[100px] items-center justify-center mx-auto px-1.5 md:px-3 py-[2px] bg-[#F0F2F5] rounded-[110px]"
          :style="{ color: getStatusColor(row?.transaction_vc_status) }"
        >
          <div class="text-12-500-20">
            {{ t(`transactions.list.status.${row.transaction_vc_status}`) }}
          </div>
          <div
            class="w-[4px] h-[4px] md:w-[6px] md:h-[6px] rounded-[1px]"
            :style="{ background: getStatusColor(row?.transaction_vc_status) }"
          ></div>
        </div>
      </template>
      <template #action-data="{ row }">
        <UButton
          @click="handleClickTransaction(row)"
          class="flex items-center py-[4px] md:py-[6px] px-1.5 md:px-4 bg-[#1C1D23] hover:bg-[#3D3E34] rounded-[6px] mx-auto"
        >
          <div class="text-12-600-20 text-white">
            {{ t('transactions.list.action.viewDetail') }}
          </div>
        </UButton>
      </template>
    </UTable>

</template>
