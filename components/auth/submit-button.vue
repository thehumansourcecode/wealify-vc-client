<script setup lang="ts">
defineProps<{
  disabled?: boolean
  loading?: boolean
  title: string
}>()
</script>
<template>
  <UButton
    class="auth__button w-full px-4 py-3 rounded-[49px] inline-flex justify-center items-center gap-2"
    :loading="loading"
    :class="
      disabled
        ? 'bg-[#a4a8b8] hover:bg-[#a4a8b8] focus:bg-[#a4a8b8] disabled:bg-[#a4a8b8]'
        : 'bg-[#ff5524] hover:bg-[#ff5524] focus:bg-[#ff5524] disabled:bg-[#ff5524]'
    "
    v-bind="$attrs"
  >
    <div
      v-if="!loading"
      class="justify-center text-base font-semibold font-['Manrope'] leading-normal"
      :class="disabled ? 'text-[#d6d8e5]' : 'text-white'"
    >
      {{ title }}
    </div>
  </UButton>
</template>
