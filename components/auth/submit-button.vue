<script setup lang="ts">
defineProps<{
  disabled?: boolean
  loading?: boolean
  title: string
}>()
</script>
<template>
  <UButton
    class="styled-button w-full px-4 py-3 inline-flex justify-center items-center"
    :loading="loading"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot>
      <div
        v-if="!loading"
        class="text-base font-semibold leading-normal"
        :class="disabled ? 'text-[#d6d8e5]' : 'text-white'"
      >
        {{ title }}
      </div>
    </slot>
  </UButton>
</template>

