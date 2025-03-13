<script lang="ts" setup>

const dashboardStore = useDashboardStore()
const isOpenTransactionDetailSlideover = computed(() => dashboardStore.isOpenTransactionDetailSlideover)
</script>

<template>
  <TransactionDetailSlideover v-if="isOpenTransactionDetailSlideover" v-model="isOpenTransactionDetailSlideover" />
</template>
