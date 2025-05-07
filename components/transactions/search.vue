<script setup lang="ts">
const { t } = useI18n()
const transactionStore = useTransactionStore()
const payload = computed(() => transactionStore.payload)
const tempKeyword = ref<string | undefined>(payload.value.keyword)

async function onEnterKeyword() {
  if (tempKeyword.value == payload.value.keyword) return
  transactionStore.setPayload({ ...payload.value, page: 1, keyword: tempKeyword.value })
}

async function loadData() {
  if (payload.value.page !== 1) {
    await transactionStore.setPayloadPage(1)
  }
  transactionStore.getTransactionList(payload.value)
}

watch(() => [payload.value.keyword], loadData, { deep: true })
</script>
<template>
  <div class="flex flex-row justify-between items-center gap-2 sm:gap-[200px]">
    <div class="flex flex-col relative gap-2 sm:gap-[10px] flex-1">
      <BaseInput
        @blur="onEnterKeyword()"
        @keyup.enter="onEnterKeyword()"
        input-class="input-field rounded-49"
        class="w-full"
        v-model.trim="tempKeyword"
        leading
        :leading-img="'/icons/common/search.svg'"
        :placeholder="t('transactions.filter.placeholder.search')"
        autocomplete="off"
      />
    </div>
    <div class="flex flex-row justify-end gap-2 sm:gap-[10px]">
      <UButton
        class="flex items-center justify-center rounded-[49px] bg-[#FF5524] disabled:bg-[#FF5524] hover:bg-[#EE4413] px-3 sm:px-4 py-1.5 sm:py-2 w-[100px] sm:w-[168px]"
        aria-disabled
        disabled
      >
        <div class="text-14 sm:text-16-600-24 text-white">{{ t('transactions.button.export') }}</div>
      </UButton>
    </div>
  </div>
</template>
