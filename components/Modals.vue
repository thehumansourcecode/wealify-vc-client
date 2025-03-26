<script lang="ts" setup>
const dashboardStore = useDashboardStore()
const cardStore = useCardStore()
const commonStore = useCommonStore()
const isOpenWalletTopupModal = computed(() => dashboardStore.isOpenWalletTopupModal)
const isOpenCardTopupModal = computed(() => cardStore.isOpenCardTopupModal)
const isOpenProcessingModal = computed(() => commonStore.isOpenProcessingModal)
const isOpenCardEditModal = computed(() => cardStore.isOpenCardEditModal)
const isOpenSensitiveOTPModal = computed(() => cardStore.isOpenSensitiveOTPModal)
</script>

<template>
  <CardTopupModal v-model="isOpenCardTopupModal" v-if="isOpenCardTopupModal" />
  <WalletTopupModal v-model="isOpenWalletTopupModal" v-if="isOpenWalletTopupModal" />
  <ProcessingModal v-model="isOpenProcessingModal" v-if="isOpenProcessingModal" />
  <CardEditModal v-model="isOpenCardEditModal" v-if="isOpenCardEditModal" />
  <SensitiveOTPModal v-model="isOpenSensitiveOTPModal" v-if="isOpenSensitiveOTPModal" />
</template>
