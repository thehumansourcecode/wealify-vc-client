<template>
  <USelectMenu
    :searchable="searchable"
    :searchable-placeholder="searchablePlaceholder"
    :options="options"
    :model-value="internalValue"
    @update:model-value="onSelectChange"
    :selected-icon="selectedIcon"
    :trailing-icon="trailingIcon"
    :ui="{
      variant: {
        none: 'bg-[#F0F2F5] border border-[#D7D9E5] text-[#7A7D89] text-12-500-20 rounded-[36px] py-[6px] px-3',
      },
      icon: {
        leading: {
          padding: { xs: 'pl-4 pr-2.5', sm: 'pl-4 pr-2.5' },
        },
      },
    }"
    :ui-menu="{
      select: 'cursor-pointer',
      base: 'relative focus:outline-none overflow-y-auto scroll-py-1',
      padding: 'p-0',
      rounded: 'rounded-[16px]',
      width: 'w-[max-content] min-w-full',
      option: {
        base: 'cursor-pointer text-14-500-20',
        selected: 'bg-[#F0F2F5]',
        active: 'bg-[#F0F2F5]',
        inactive: 'cursor-pointer',
        padding: 'px-3 py-[10px]',
        rounded: 'rounded-none',
        selectedIcon: {
          base: 'h-[18px] w-[18px]',
        },
        empty: 'text-sm',
      },
      empty: 'text-sm',
      input: 'px-3 py-[10px] w-full text-[#7A7D89] icon-search font-medium text-sm leading-5 m-0 bg-white',
    }"
    variant="none"
  >
    <!-- Forward the "label" slot to USelectMenu -->
    <template #label>
      <slot name="label" />
    </template>
    <template #option="{ option }">
      <slot name="option" :option="option" />
    </template>
    <template #default="{ open }">
      <slot name="default" :open="open" />
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  multiple: Boolean,
  searchable: Boolean,
  searchablePlaceholder: String,
  trailingIcon: {
    type: String,
    default: '',
  },
  selectedIcon: {
    type: String,
    default: '',
  },
  // The array you want to select into (from the parent)
  modelValue: {
    type: String,
    default: null,
  },

  // The dropdown options (whatever shape USelectMenu expects)
  options: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

// 1) Local copy of the array
const internalValue = ref(props.modelValue)

function onSelectChange(newValue) {
  console.log(newValue, 'new')
  console.log(internalValue.value, 'internal')

  if (internalValue.value === newValue) {
    console.log('Deselecting:', newValue)

    internalValue.value = null
    emit('update:modelValue', null)
  } else {
    console.log('Selecting:', newValue)
    internalValue.value = newValue
    emit('update:modelValue', newValue)
  }
}
// 3) If the parent updates the array externally, sync changes here
watch(
  () => props.modelValue,
  newVal => {
    internalValue.value = newVal
  },
  { deep: true },
)
</script>

<style lang="scss">
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

.icon-search {
  background:
    url('/icons/common/search.svg') no-repeat left center,
    #fff;
  padding-left: 40px;
  background-position-x: 12px;
  z-index: 100;
}
</style>
