<script setup lang="ts">
const { t } = useI18n()
const transactionStore = useTransactionStore()
const payload = computed(() => transactionStore.payload)
const transactionCount = computed(() => transactionStore.transactionCount)
const limitOptions = ref([10, 30, 50])
const page = computed(() => payload.value.page)
const limit = computed(() => payload.value.limit)

async function onChangePage(page: number) {
  await transactionStore.setPayloadPage(page)
  transactionStore.getTransactionList(payload.value)
}

watch(
  () => [payload.value.limit],
  async () => {
    if (page.value !== 1) {
      await transactionStore.setPayloadPage(1)
    }
    transactionStore.getTransactionList(payload.value)
  },
  { deep: true },
)

onMounted(() => {
  transactionStore.getTransactionList(payload.value)
})

</script>
<template>
  <div class="rounded-[12px] flex flex-col border border-[#D7D9E5] mb-8 overflow-x-auto w-full">
    <TransactionsList />
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 gap-10 items-center">
      <USelectMenu v-model="payload.limit" :options="limitOptions" selected-icon="i-selected">
        <template #option="{ option }">
          <div
            className="self-stretch justify-center text-[#1b1c23] text-sm font-medium font-['Manrope'] leading-tight"
          >
            {{ t(`transactions.list.pagination.limit`, { limit: option }) }}
          </div>
        </template>
        <div class="border border-[#D7D9E5] rounded-[90px] py-[10px] pl-5 pr-4 flex flex-row gap-8">
          <div class="text-14-500-20 text-[#1C1D23]">
            {{ t(`transactions.list.pagination.limit`, { limit }) }}
          </div>
          <img src="/images/transactions/dropdown.svg" alt="" />
        </div>
      </USelectMenu>
      <BasePagination
        @update:model-value="onChangePage"
        :model-value="payload.page"
        :limit="payload.limit"
        :total="transactionCount"
      />
    </div>
  </div>
</template>
