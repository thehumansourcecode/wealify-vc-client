<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
import { formatMoney } from '~/common/functions'
import type { CardCategory, CardStatus } from '~/types/cards'
import { TransactionStatus, TransactionType } from '~/types/dashboard'

const { t } = useI18n()
const transactionStore = useTransactionStore()
const dashboardStore = useDashboardStore()
const transactionList = computed(() => transactionStore.transactionList)

const page = ref(1)

const pageCountOptions = ref([10, 30, 50])
const pageCount = ref(pageCountOptions.value[0])

const payload = ref({
  keyword: undefined,
  type: [],
  statuses: [] as CardStatus[],
  dateRange: [undefined, undefined] as [Date | undefined, Date | undefined],
})

const statusOptions = Object.values(TransactionStatus)

function isStatusSelected(status: CardStatus) {
  return payload.value.statuses.includes(status)
}

const rows = computed(() => {
  return transactionList.value.slice((page.value - 1) * pageCount.value, page.value * pageCount.value)
})

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

async function onClickViewDetail() {
  // await call API
  dashboardStore.toggleTransactionDetailSlideover(true)
}
</script>
<template>
  <div class="flex flex-col overflow-y-auto pl-10 pr-[60px] flex-1 gap-5 mt-7">
    <!-- Cards not selected -->
    <div class="flex flex-row justify-between items-start gap-[200px]">
      <div class="flex flex-col relative gap-[10px] flex-1">
        <BaseInput
          input-class="input-field rounded-49"
          class="w-full w-[75%]"
          leading
          :leading-img="'/images/transactions/glass.svg'"
          :placeholder="t('transactions.filter.placeholder.search')"
          autocomplete="off"
        />
      </div>
      <div class="flex flex-row justify-end gap-[10px]">
        <UButton
          class="flex items-center justify-center rounded-[49px] bg-[#FF5524] disabled:bg-[#FF5524] hover:bg-[#EE4413] px-4 py-2 w-[168px]"
          aria-disabled
          disabled
        >
          <div class="text-white text-16-600-24">{{ t('transactions.button.export') }}</div>
        </UButton>
      </div>
    </div>
    <!-- Filters -->
    <div class="flex flex-row gap-5 pb-5 items-center">
      <!-- Date -->
      <DatePicker v-model="payload.dateRange" />

      <img src="~/assets/img/common/line.svg" alt="" />

      <!-- Type -->
      <TransactionsTypeSelection v-model="payload.type" />

      <img src="~/assets/img/common/line.svg" alt="" />

      <!-- Status -->
      <BaseMultipleSelect class="w-[150px]" multiple :options="statusOptions" v-model="payload.statuses">
        <template #default="{ open: open }">
          <div
            class="px-3 py-[6px] w-full rounded-[36px] bg-[#f0f2f5] border flex items-center justify-between"
            :class="open ? 'border-[#FF5524]' : 'border-[f0f2f5]'"
          >
            <div class="text-12-500-20 text-[#7A7D89]">
              <span v-if="payload.statuses.length == 1">
                {{ t(`transactions.list.status.${payload.statuses[0]}`) }}
              </span>
              <span v-else-if="payload.statuses.length > 1" class="text-12-500-20 text-[#7A7D89]">
                {{ payload.statuses.length }} selected
              </span>
              <span v-else>
                {{ t('transactions.filter.label.status') }}
              </span>
            </div>
            <img
              v-if="!payload.statuses.length"
              src="/assets/img/icons/dropdown.svg"
              class="transition-transform"
              :class="[open && 'transform rotate-180']"
            />
            <img
              @click.prevent="payload.statuses = []"
              v-else
              class="cursor-pointer"
              src="/assets/img/icons/clear.svg"
              alt=""
            />
          </div>
        </template>
        <template #option="{ option: status }">
          <div class="flex flex-row gap-[9px]">
            <UCheckbox
              @click.passive
              :model-value="isStatusSelected(status)"
              :ui="{
                base: 'cursor-pointer',
              }"
            />
            <span class="text-[#1C1D23] text-14-500-20">
              {{ t(`transactions.list.status.${status}`) }}
            </span>
          </div>
        </template>
      </BaseMultipleSelect>
    </div>
    <div class="rounded-[12px] flex flex-col border border-[#D7D9E5] mb-8 overflow-x-auto w-full">
      <!-- Table -->
      <UTable
        selectable
        v-if="transactionList?.length"
        :rows="rows"
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
            <img :src="`/images/transactions/${row.type.label}.svg`" alt="" />
            <div class="flex flex-col gap-1">
              <span class="text-14-600-20 text-[#1b1c23] text-sm font-semibold font-['Manrope'] leading-tight">{{
                t(`transactions.list.type.${row.type.label}`)
              }}</span>
              <span class="text-12-500-20 text-[#7A7D89]">{{ t(`transactions.list.type.${row.type.method}`) }}</span>
            </div>
          </div>
        </template>
        <template #transactionId-data="{ row }">
          <div class="text-14-500-20 w-[160px] text-[#7A7D89]">{{ row.transactionId }}</div>
        </template>
        <template #amount-data="{ row }">
          <div class="text-16-700-24 w-[150px] text-[#1C1D23] text-center">
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
          <div class="text-14-500-20 w-[120px] text-[#FF5524] text-center">{{ row.currency }}</div>
        </template>
        <template #card-data="{ row }">
          <div v-if="row.card" class="flex flex-row items-center gap-[14px] w-[218px]">
            <img src="/images/transactions/mastercard.svg" alt="" />
            <div class="flex flex-col gap-1">
              <span class="text-14-600-20 text-[#1C1D23]">{{ row.card.cardName }}</span>
              <span class="text-12-500-20 text-[#7A7D89]"> {{ row.card.cardNumber }}</span>
            </div>
          </div>
        </template>
        <template #status-data="{ row }">
          <div
            class="flex flex-row gap-[6px] w-[120px] items-center justify-center mx-auto px-3 py-[2px] bg-[#F0F2F5] rounded-[110px]"
            :style="{ color: getStatusColor(row?.status) }"
          >
            <div class="text-12-500-20">
              {{ t(`transactions.list.status.${row.status}`) }}
            </div>
            <div class="w-[6px] h-[6px] rounded-[1px]" :style="{ background: getStatusColor(row?.status) }"></div>
          </div>
        </template>
        <template #action-data="{}">
          <UButton
            @click="onClickViewDetail"
            class="flex items-center py-[6px] px-4 bg-[#1C1D23] hover:bg-[#3D3E34] rounded-[6px] mx-auto"
          >
            <div class="text-12-600-20 text-white">
              {{ t('transactions.list.action.viewDetail') }}
            </div>
          </UButton>
        </template>
      </UTable>
      <div v-else class="flex flex-col items-center justify-center gap-4 h-full">
        <img src="/images/transactions/no-transaction.svg" alt="" />
        <div class="text-14-500-20 text-[#A5A8B8]">{{ t('transactions.list.empty') }}</div>
      </div>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 gap-10 items-center">
        <USelectMenu v-model="pageCount" :options="pageCountOptions" selected-icon="i-selected">
          <template #option="{ option }">
            <div
              className="self-stretch justify-center text-[#1b1c23] text-sm font-medium font-['Manrope'] leading-tight"
            >
              {{ t(`transactions.list.pagination.limit`, { limit: option }) }}
            </div>
          </template>
          <div class="border border-[#D7D9E5] rounded-[90px] py-[10px] pl-5 pr-4 flex flex-row gap-8">
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ t(`transactions.list.pagination.limit`, { limit: pageCount }) }}
            </div>
            <img src="/images/transactions/dropdown.svg" alt="" />
          </div>
        </USelectMenu>
        <UPagination
          size="md"
          :max="6"
          v-model="page"
          :page-count="pageCount"
          :total="transactionList?.length"
          class="pagination-custom"
          :active-button="{
            color: '',
            variant: 'ghost',
            class: 'bg-[#FF5524] rounded-full w-10 h-10 text-center justify-center text-white p-3',
          }"
          :inactive-button="{
            color: '',
            variant: 'ghost',
            class: 'rounded-full border border-[#D7D9E5] w-10 h-10 justify-center',
          }"
          :ui="{
            wrapper: 'flex items-center -space-x-px gap-[6px]',
            default: {
              activeButton: {},
            },
          }"
        >
          <template #prev="{ onClick, canGoPrev }">
            <UTooltip text="Previous page">
              <UButton class="p-0 shadow-none bg-[#FFFFFF] hover:bg-[#FFFFFF]" @click="onClick">
                <img
                  :class="canGoPrev ? '' : 'opacity-50 cursor-not-allowed'"
                  src="/images/transactions/back.svg"
                  alt=""
                />
              </UButton>
            </UTooltip>
          </template>
          <template #next="{ onClick, canGoNext }">
            <UTooltip text="Next page">
              <UButton class="p-0 shadow-none bg-[#FFFFFF] hover:bg-[#FFFFFF]" @click="onClick">
                <img
                  :class="canGoNext ? '' : 'opacity-50 cursor-not-allowed'"
                  src="/images/transactions/next.svg"
                  alt=""
                />
              </UButton>
            </UTooltip>
          </template>
        </UPagination>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  background: #888888;
}
::-webkit-scrollbar-track {
  background: #f0f0f0;
}
</style>
