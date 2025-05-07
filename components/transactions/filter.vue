<script setup lang="ts">
import dayjs from 'dayjs'
import { formatDDMMYYYYHHMM } from '~/common/functions'

const transactionStore = useTransactionStore()
const payload = computed(() => transactionStore.payload)
const dateRange = ref<[Date | undefined, Date | undefined]>([undefined, undefined])

watch(dateRange, () => {
  const start_date = dateRange.value[0] ? dateFormat(dateRange.value[0],'yyyy-MM-dd') : undefined
  const end_date = dateRange.value[1] ? dateFormat(dateRange.value[1],'yyyy-MM-dd') : undefined

  if (payload.value.start_date == start_date && payload.value.end_date == end_date) {
    return
  }

  transactionStore.setPayload({
    ...payload.value,
    start_date,
    end_date,
  })
})

watch(
  () => [
    payload.value.transaction_status,
    payload.value.transaction_type,
    payload.value.start_date,
    payload.value.end_date,
  ],
  async () => {
    if (payload.value.page !== 1) {
      await transactionStore.setPayloadPage(1)
    }
    transactionStore.getTransactionList(payload.value)
  },
  { deep: true },
)
</script>
<template>
  <div class="flex flex-row gap-2 sm:gap-5 pb-3 sm:pb-5 items-center overflow-x-auto">
    <!-- Date -->
    <DatePicker v-model="dateRange" class="min-w-[140px] sm:min-w-[160px]" />

    <img src="~/assets/img/common/line.svg" alt="" class="hidden sm:block" />

    <!-- Type -->
    <TransactionsTypeSelection v-model="payload.transaction_type" class="min-w-[140px] sm:min-w-[160px]" />

    <img src="~/assets/img/common/line.svg" alt="" class="hidden sm:block" />

    <!-- Status -->
    <TransactionsStatusSelection v-model="payload.transaction_status" class="min-w-[140px] sm:min-w-[160px]" />
  </div>
</template>
