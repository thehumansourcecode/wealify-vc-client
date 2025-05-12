<script setup lang="ts">
import { USlideover } from '#components'

const props = defineProps<{
  isOpen: boolean
  title: string
}>()

const emit = defineEmits(['update:isOpen', 'close'])

const handleClose = () => {
  emit('update:isOpen', false)
  emit('close')
}
</script>

<template>
  <USlideover
    :model-value="isOpen"
    @update:model-value="(value) => emit('update:isOpen', value)"
    :ui="{
      overlay: {
        background: 'bg-gray-200/20',
      },
      container: 'flex items-center justify-end',
      width: 'w-full sm:w-[540px]',
      background: 'bg-white',
    }"
    @close="handleClose"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
        <button
          class="text-gray-400 hover:text-gray-500"
          @click="handleClose"
        >
          <UIcon name="i-heroicons-x-mark-20-solid" class="w-6 h-6" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <slot></slot>
      </div>
    </div>
  </USlideover>
</template> 