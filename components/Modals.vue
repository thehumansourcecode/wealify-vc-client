<script lang="ts" setup>
const dashboardStore = useDashboardStore()
const cardStore = useCardStore()
const commonStore = useCommonStore()
const isOpenWalletTopupModal = computed(() => dashboardStore.isOpenWalletTopupModal)
const isOpenCardTopupModal = computed(() => cardStore.isOpenCardTopupModal)
const isOpenProcessingModal = computed(() => commonStore.isOpenProcessingModal)
</script>

<template>
  <CardTopupModal v-if="isOpenCardTopupModal" v-model="isOpenCardTopupModal" />
  <WalletTopupModal v-if="isOpenWalletTopupModal" v-model="isOpenWalletTopupModal" />
  <ProcessingModal v-if="isOpenProcessingModal" v-model="isOpenProcessingModal" />
</template>
