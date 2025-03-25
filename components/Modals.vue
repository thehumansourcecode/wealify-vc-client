<script lang="ts" setup>

const dashboardStore = useDashboardStore()
const cardStore = useCardStore()
const isOpenWalletTopupModal = computed(() => dashboardStore.isOpenWalletTopupModal)
const isOpenCardTopupModal = computed(() => cardStore.isOpenCardTopupModal)
</script>

<template>
  <CardTopupModal v-if="isOpenCardTopupModal" v-model="isOpenCardTopupModal" />
  <WalletTopupModal v-if="isOpenWalletTopupModal" v-model="isOpenWalletTopupModal" />

</template>
