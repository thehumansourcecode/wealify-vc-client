<script lang="ts" setup>
const transactionStore = useTransactionStore()
const cardStore = useCardStore()
const isOpenTransactionDetailSlideover = computed(() => transactionStore.isOpenTransactionDetailSlideover)
const isOpenCardDetailSlideover = computed(() => cardStore.isOpenCardDetailSlideover)
</script>

<template>
  <TransactionDetailSlideover />
  <CardDetailSlideover />
</template>
