<template>
  <UInput
    ref="inputRef"
    class="w-full text-20-700-32 items-center flex"
    autocomplete="off"
    variant="none"
    v-model="formattedValue"
    @input="handleInputAmount"
    @keydown="removeDots"
    :ui="{
      padding: {
        sm: 'p-0 text-[20px]',
      },
    }"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: number
  maxLimit?: number
}>()

const emit = defineEmits(['update:modelValue'])

const inputRef = ref<any>(null) // Temporarily use 'any' until we confirm the component structure
const actualInput = ref<HTMLInputElement | null>(null)
defineExpose({
  blurInput: () => {
    console.log(inputRef.value)
    actualInput.value?.blur()
  },
  focusInput: () => {
    console.log(inputRef.value)
    actualInput.value?.focus()
  },
})

onMounted(() => {
  if (inputRef.value) {
    // Depending on UInput's structure, find the actual input element
    // This might need adjustment based on your specific UInput component
    actualInput.value = inputRef.value.$el?.querySelector('input') || inputRef.value
  }
})

const MAX_SPEND_LIMIT = props.maxLimit || 999999999 // Default max limit if not provided
const localAmount = ref(props.modelValue || 0)
const originalNumericValue = ref(0)

const formattedValue = computed({
  get: () => {
    const formatter = new Intl.NumberFormat('en-US')
    return formatter.format(localAmount.value)
  },
  set: (value: string) => {
    const newValue = Number(value.replace(/,/g, '')) || 0
    localAmount.value = newValue
    emit('update:modelValue', newValue)
  },
})

const formatAmount = (target: HTMLInputElement) => {
  const rawValue = Number(target.value.split(',').join(''))

  if (Number.isNaN(rawValue)) {
    target.value = formattedValue.value
    return
  }

  if (rawValue === localAmount.value) {
    const formatter = new Intl.NumberFormat('en-US')
    target.value = formatter.format(localAmount.value)
    return
  }

  if (rawValue > MAX_SPEND_LIMIT) {
    const formatter = new Intl.NumberFormat('en-US')
    target.value = formatter.format(localAmount.value)
    return
  }

  target.value = target.value.trim()
  originalNumericValue.value = rawValue
}

const removeDots = (event: KeyboardEvent) => {
  if (event.key === '.' || event.key === ',') {
    event.preventDefault()
  }
}

const handleInputAmount = async (event: Event) => {
  const target = event.target as HTMLInputElement
  let caretPosition = target.selectionStart || 0
  const originalPositionRight = target.value.length - caretPosition

  try {
    formatAmount(target)
    setTimeout(() => {
      caretPosition = target.value.length === 1 ? 1 : target.value.length - originalPositionRight
      target.setSelectionRange(caretPosition, caretPosition)
    }, 0)
  } catch (error) {
    console.log(error)
  }
}

// Watch for external modelValue changes
watch(
  () => props.modelValue,
  newValue => {
    if (newValue !== localAmount.value) {
      localAmount.value = newValue || 0
    }
  },
)
</script>
