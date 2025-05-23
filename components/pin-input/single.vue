<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

type Props = {
  inputType?: 'number' | 'tel' | 'letter-numeric' | 'password'
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  value: string
  separator: string
  focus: boolean
  inputClasses: string | string[]
  conditionalClass?: string
  shouldAutoFocus: boolean
  isLastChild: boolean
  placeholder?: string
  isDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  inputType: 'tel',
  inputmode: 'numeric',
  separator: '',
  focus: false,
  inputClasses: '',
  conditionalClass: '',
  shouldAutoFocus: false,
  isLastChild: false,
  placeholder: '',
  isDisabled: false,
})

const emit = defineEmits<{
  (e: 'on-change', value: string | number): void
  (e: 'on-keydown', event: KeyboardEvent): void
  (e: 'on-paste', event: ClipboardEvent): void
  (e: 'on-focus'): void
  (e: 'on-blur'): void
}>()

const model = ref(props.value || '')
const input = ref<HTMLInputElement | null>(null) as Ref<HTMLInputElement>

const handleOnChange = () => {
  model.value = model.value
  if (model.value.length > 1) {
    model.value = model.value.slice(0, 1)
  }
  return emit('on-change', model.value.toString())
}

const isCodeLetter = (charCode: number) => charCode >= 65 && charCode <= 90
const isCodeNumeric = (charCode: number) => (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)
// numeric keys and numpad keys

const handleOnKeyDown = (event: KeyboardEvent) => {
  if (props.isDisabled) {
    event.preventDefault()
  }
  // Only allow characters 0-9, DEL, Backspace, Enter, Right and Left Arrows, and Pasting
  const keyEvent = event || window.event
  const charCode = keyEvent.which ? keyEvent.which : keyEvent.keyCode
  if (
    isCodeNumeric(charCode) ||
    (props.inputType === 'letter-numeric' && isCodeLetter(charCode)) ||
    [8, 9, 13, 37, 39, 46, 86].includes(charCode)
  ) {
    emit('on-keydown', event)
  } else {
    keyEvent.preventDefault()
  }
}

const handleOnPaste = (event: ClipboardEvent) => emit('on-paste', event)

const handleOnFocus = () => {
  input.value.select()
  return emit('on-focus')
}

const handleOnBlur = () => emit('on-blur')

const inputTypeValue = computed(() =>
  ['letter-numeric', 'number'].includes(props.inputType) ? 'text' : props.inputType,
)

watch(
  () => props.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      model.value = newValue
    }
  },
)

watch(
  () => props.focus,
  (newFocusValue, oldFocusValue) => {
    // Check if focusedInput changed
    // Prevent calling function if input already in focus
    if (oldFocusValue !== newFocusValue && input.value && props.focus) {
      input.value.focus()
      input.value.select()
    }
  },
)

onMounted(() => {
  if (input.value && props.focus && props.shouldAutoFocus) {
    input.value.focus()
    input.value.select()
  }
})
</script>

<template>
  <div style="display: flex; align-items: center">
    <input
      :type="inputTypeValue"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :disabled="isDisabled"
      ref="input"
      min="0"
      max="9"
      :maxlength="1"
      pattern="[0-9]"
      v-model="model"
      :class="[inputClasses, conditionalClass, { 'is-complete': model }]"
      @input="handleOnChange"
      @keydown="handleOnKeyDown"
      @paste="handleOnPaste"
      @focus="handleOnFocus"
      @blur="handleOnBlur"
    />
    <span v-if="!isLastChild && separator">
      <span v-html="separator"></span>
    </span>
  </div>
</template>
