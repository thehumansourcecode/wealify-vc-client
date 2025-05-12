<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
</script>

<template>
  <div class="flex flex-col px-3 sm:px-4 md:px-6 lg:px-10 xl:pr-[60px] flex-1 gap-3 sm:gap-6 mt-4 sm:mt-7">
    <TransactionsSearch />
    <TransactionsFilter />
    <TransactionsPaginationList />
  </div>
</template>

<style lang="css" scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  background: #888888;
}
::-webkit-scrollbar-track {
  background: #f0f0f0;
}
</style>
