<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <BaseModal>
    <div class="flex flex-col items-center justify-center w-[320px]">
      <!-- Spinning circle -->
      <div class="w-12 h-12 border-4 border-t-transparent border-red-500 rounded-full animate-spin"></div>
      <!-- Text -->
      <h2 class="mt-4 text-16-700-24 text-center">Processing</h2>
      <p class="mt-2 text-14-500-20 text-[#7A7D89] text-center">We’re processing your request. One moment please</p>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
