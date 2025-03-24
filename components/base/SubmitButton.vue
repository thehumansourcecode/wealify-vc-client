<script setup lang="ts">
defineProps<{
  isSubmitEnabled?: boolean
  loading?: boolean
  title: string
}>()
</script>

<template>
  <UButton
    class="flex styled-button items-center justify-center rounded-[49px] bg-[#FF5524] py-3 w-full mt-6"
    :loading="loading"
    :disabled="!isSubmitEnabled"
    :class="
      isSubmitEnabled
        ? 'bg-[#FF5524] text-[#FFFFFF] hover:bg-[#EE4413]'
        : 'bg-[#A5A8B8] text-[#D7D9E5] hover:bg-[#B6B9C9] cursor-not-allowed'
    "
  >
    <div v-if="!loading" class="text-white text-16-600-24">
      {{ title }}
    </div>
  </UButton>
</template>

<style lang="scss" scoped>
.styled-button:disabled {
  background-color: #a4a8b8 !important;
}
</style>
