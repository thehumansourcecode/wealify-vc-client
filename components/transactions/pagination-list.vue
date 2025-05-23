<script setup lang="ts">
const { t } = useI18n()
const transactionStore = useTransactionStore()
const { payload } = storeToRefs(transactionStore)
const transactionCount = computed(() => transactionStore.transactionCount)
const limitOptions = ref([10, 30, 50])
const page = computed(() => payload.value.page)
const limit = computed(() => payload.value.limit)

async function onChangePage(page: number) {
  await transactionStore.setPayloadPage(page)
  transactionStore.getTransactionList(payload.value)
}

const init = async() => {
  payload.value.limit = 10
  await transactionStore.getTransactionList(payload.value)
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

onMounted(async() => {
  await init()
})

</script>
<template>
  <div class="rounded-[12px] flex flex-col border border-[#D7D9E5] mb-8 overflow-x-auto w-full">
    <TransactionsList />
    <div class="flex flex-row justify-between sm:justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-10 items-center">
      <USelectMenu v-model="payload.limit" :options="limitOptions" selected-icon="i-selected" class="hidden sm:block w-[160px] sm:w-auto">
        <template #option="{ option }">
          <div class="self-stretch justify-center text-[#1b1c23] text-12 md:text-14-500-20 font-medium font-['Manrope'] leading-tight">
            {{ t(`transactions.list.pagination.limit`, { limit: option }) }}
          </div>
        </template>
        <div class="border border-[#D7D9E5] rounded-[90px] py-1.5 md:py-[10px] px-2 md:pl-5 md:pr-4 flex flex-row gap-8 w-[160px] sm:w-auto">
          <div class="text-14-500-20 text-[#1C1D23]">
            {{ t(`transactions.list.pagination.limit`, { limit }) }}
          </div>
          <img src="/images/transactions/dropdown.svg" alt="" class="w-3 h-3 md:w-auto md:h-auto mt-[5px] md:mt-[0px]" />
        </div>
      </USelectMenu>
      <div class="flex-1 sm:flex-none flex justify-center sm:justify-end">
        <BasePagination
          @update:model-value="onChangePage"
          :model-value="payload.page"
          :limit="payload.limit"
          :total="transactionCount"
          :ui="{
            wrapper: 'flex items-center gap-1 md:gap-2',
            default: {
              size: 'text-14-500-20',
              padding: 'p-1 md:p-2',
              base: 'text-[#7A7D89]',
              active: 'text-[#1C1D23]',
            },
          }"
        />
      </div>
    </div>
  </div>
</template>
