<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  subtitle2?: string
  back: () => void
}>()
</script>
<template>
  <!-- DON'T DELETE DIV -->
  <div></div>
  <div></div>
  <!-- DON'T DELETE DIV -->
  <div class="flex flex-col gap-2">
    <slot name="title">
      <div
        class="text-center justify-center text-[#1b1c23] xl:text-[32px] text-[22px] font-bold leading-[44px]"
      >
        {{ title }}
      </div>
    </slot>
    <slot name="subtitle">
      <div
        class="text-center justify-start text-[#7a7c89] text-sm font-medium leading-tight"
      >
        {{ subtitle }}
      </div>
    </slot>
    <slot name="subtitle2">
      <div
        v-if="subtitle2"
        class="text-center justify-start text-[#7a7c89] text-sm font-medium leading-tight"
      >
        {{ subtitle2 }}
      </div>
    </slot>
  </div>
  <slot />
  <!-- DON'T DELETE DIV -->
  <div></div>
  <div></div>
  <div></div>
  <!-- DON'T DELETE DIV -->
  <div @click="back()" class="styled-text-button inline-flex justify-start items-start gap-2 cursor-pointer">
    <img class="w-full h-full" src="/images/auth/back.svg" />
    <div class="text-base font-medium leading-normal">Back</div>
  </div>
</template>
