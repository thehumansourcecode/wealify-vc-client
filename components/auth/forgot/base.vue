<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  back: () => void
}>()
</script>
<template>
  <!-- DON'T DELETE DIV -->
  <div></div>
  <div></div>
  <!-- DON'T DELETE DIV -->
  <div class="auth__head flex flex-col gap-2">
    <div
      class="auth__title text-center justify-center text-[#1b1c23] xl:text-[32px] text-[22px] font-bold font-['Manrope'] leading-[44px]"
    >
      {{ title }}
    </div>
    <div
      class="auth__subtitle text-center justify-start text-[#7a7c89] text-sm font-medium font-['Manrope'] leading-tight"
    >
      {{ subtitle }}
    </div>
  </div>
  <slot />
  <!-- DON'T DELETE DIV -->
  <div></div>
  <div></div>
  <div></div>
  <!-- DON'T DELETE DIV -->
  <div @click="back()" className="inline-flex justify-start items-start gap-2 cursor-pointer">
    <img class="w-full h-full" src="/images/auth/back.svg" />
    <div className="justify-center text-[#ff5524] text-base font-medium font-['Manrope'] leading-normal">Back</div>
  </div>
</template>
