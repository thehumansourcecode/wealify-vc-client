<script setup lang="ts">
const { t } = useI18n()

const transactionStore = useTransactionStore()

const init = async () => {
  await transactionStore.setPayload({
    ...transactionStore.payload,
    limit: 5,
    dataSort: {
      direction: 'DESC',
    },
  })
  transactionStore.getTransactionList(transactionStore.payload)
}

onMounted(init)

onActivated(init)

onUpdated(init)

onUnmounted(() =>
  // Reset payload
  transactionStore.setPayload({
    page: 1,
    limit: 10,
    keyword: undefined,
    transaction_type: undefined,
    transaction_status: undefined,
    start_date: undefined,
    end_date: undefined,
  }),
)
</script>
<template>
  <div class="rounded-[12px] flex flex-col border border-[#D7D9E5] mb-8 grow overflow-hidden">
    <div class="px-5 flex flex-row justify-between items-center pt-3 pb-5">
      <span class="text-[#1C1D23] text-[18px] font-semibold leading-7">
        {{ t('transactions.recentTitle') }}
      </span>
      <ULink to="/transactions">
        <UButton
          class="flex items-center justify-center rounded-[110px] bg-[#F0F2F5] hover:bg-[#E1E3E6] text-[#1C1D23] text-14-600-20 px-4 py-2"
        >
          {{ t('transactions.viewAll') }}
        </UButton>
      </ULink>
    </div>
    <TransactionsList />
  </div>
</template>
