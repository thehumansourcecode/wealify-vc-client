<script setup lang="ts">
defineProps<{
  title: string
  icon: string
  index: number
  selected: boolean
  onSelect: (index: number) => void
}>()
</script>
<template>
  <div
    @click="onSelect(index)"
    class="w-full p-4 border-b-[0.70px] border-[#d6d8e5] inline-flex justify-start items-center gap-3 cursor-pointer"
    :class="selected ? 'bg-[#d6d8e5] ' : 'bg-[none]'"
  >
    <img class="w-[26px] h-[26px] relative rounded-[5px] overflow-hidden" :src="icon" />
    <div class="flex-1 justify-center text-[#1b1c23] text-sm font-semibold font-['Manrope'] leading-tight">
      {{ title }}
    </div>
    <img class="w-5 h-5 relative" src="/images/settings/arrow-right.svg" />
  </div>
</template>
