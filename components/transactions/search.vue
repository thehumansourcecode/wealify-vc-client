<script setup lang="ts">
const { t } = useI18n()
const transactionStore = useTransactionStore()
const payload = computed(() => transactionStore.payload)
const tempKeyword = ref<string | undefined>(payload.value.keyword)

async function onEnterKeyword() {
  if (tempKeyword.value == payload.value.keyword) return
  await transactionStore.setPayload({ ...payload.value, page: 1, keyword: tempKeyword.value })
  transactionStore.getTransactionList(payload.value)
}
</script>
<template>
  <!-- Cards not selected -->
  <div class="flex flex-row justify-between items-start gap-[200px]">
    <div class="flex flex-col relative gap-[10px] flex-1">
      <BaseInput
        @blur="onEnterKeyword()"
        @keyup.enter="onEnterKeyword()"
        input-class="input-field rounded-49"
        class="w-[80%]"
        v-model="tempKeyword"
        leading
        :leading-img="'/icons/common/search.svg'"
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
</template>
