<script setup lang="ts">
defineProps<{
  title: string
  status: boolean
  onSelect?: () => void
}>()
</script>
<template>
  <div
    @click="onSelect"
    class="w-full px-4 py-0.5 bg-[#f0f2f5] rounded-[18px] inline-flex flex-col justify-start items-start cursor-pointer"
  >
    <div class="self-stretch py-4 inline-flex justify-start items-center gap-3">
      <div class="flex-1 justify-center text-[#1b1c23] text-sm font-semibold font-['Manrope'] leading-tight">
        {{ title }}
      </div>
      <img class="w-[22px] h-[22px] relative" src="/images/settings/checked.svg" />
    </div>
  </div>
</template>
