<template>
  <div class="flex flex-col overflow-y-auto pl-10 pr-[60px] flex-1 gap-5 mt-7">
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
