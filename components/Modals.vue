<script lang="ts" setup>
const dashboardStore = useDashboardStore()
const isOpenTopupModal = computed(() => dashboardStore.isOpenTopupModal)
</script>

<template>
  <TopupModal v-if="isOpenTopupModal" v-model="isOpenTopupModal" />
</template>
