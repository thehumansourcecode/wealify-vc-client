<script lang="ts" setup>
const dashboardStore = useDashboardStore()
const cardStore = useCardStore()
const isOpenTransactionDetailSlideover = computed(() => dashboardStore.isOpenTransactionDetailSlideover)
const isOpenCardDetailSlideover = computed(() => cardStore.isOpenCardDetailSlideover)
</script>

<template>
  <TransactionDetailSlideover v-if="isOpenTransactionDetailSlideover" v-model="isOpenTransactionDetailSlideover" />
  <CardDetailSlideover v-if="isOpenCardDetailSlideover" v-model="isOpenCardDetailSlideover" />
</template>
