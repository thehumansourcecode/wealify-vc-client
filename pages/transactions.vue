<script setup lang="ts">
import { PanelTab } from '~/types/common'

definePageMeta({
  layout: 'home',
})
const commonStore = useCommonStore()

onMounted(() => {
  commonStore.setActiveTab(PanelTab.TRANSACTIONS)
})
</script>

<template>
  <div class="w-full h-full">
    <TransactionsMain />
  </div>
</template>
