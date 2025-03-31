<script setup lang="ts">
import dayjs from 'dayjs'
import { formatDDMMYYYYHHMM } from '~/common/functions'

const transactionStore = useTransactionStore()
const payload = computed(() => transactionStore.payload)
const dateRange = ref<[Date | undefined, Date | undefined]>([undefined, undefined])

watch(dateRange, () => {
  const start_date = dateRange.value[0] ? dayjs(dateRange.value[0]).utc().toISOString() : undefined
  const end_date = dateRange.value[0] ? dayjs(dateRange.value[1]).utc().toISOString() : undefined

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
  <!-- Filters -->
  <div class="flex flex-row gap-5 pb-5 items-center">
    <!-- Date -->
    <DatePicker v-model="dateRange" />

    <img src="~/assets/img/common/line.svg" alt="" />

    <!-- Type -->
    <TransactionsTypeSelection v-model="payload.transaction_type" />

    <img src="~/assets/img/common/line.svg" alt="" />

    <!-- Status -->
    <TransactionsStatusSelection v-model="payload.transaction_status" />
  </div>
</template>
