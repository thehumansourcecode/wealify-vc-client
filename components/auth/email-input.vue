<script setup lang="ts">
const { error } = defineProps<{
  error?: string | undefined
  placeholder?: string | undefined
}>()

// Use defineModel to create a two-way binding for the 'value' prop
const email = defineModel<string>('value', { default: '' })

const emailRef = ref<any>()

// Handle input event with typed event parameter
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string = target.value
  // Remove leading and trailing spaces
  value = value.trim()
  // Update email value
  email.value = value
  if (emailRef.value && emailRef.value.input) {
    emailRef.value.value = email.value
    emailRef.value.input.value = email.value
  }
}

// Handle paste event with typed event parameter
const handlePaste = (event: ClipboardEvent) => {
  const pastedText: string = (event.clipboardData || (window as any).clipboardData).getData('text')
  // If length exceeds 128, truncate from the 129th character
  if (pastedText.length > 128) {
    event.preventDefault()
    email.value = pastedText.substring(0, 128).trim()
    if (emailRef.value && emailRef.value.input) {
      emailRef.value.value = email.value
      emailRef.value.input.value = email.value
    }
  } else {
    email.value = pastedText.trim()
  }
}
</script>
<template>
  <UInput
    ref="emailRef"
    class="w-full"
    variant="none"
    :input-class="[`styled-input`, `${error ? 'error' : ''}`].join(' ')"
    :ui="{
      padding: {
        sm: 'pr-7 pl-1.5 py-1.5',
      },
      leading: {
        padding: {
          sm: 'ps-10',
        },
      },
      icon: {
        leading: {
          padding: {
            sm: 'pl-4 pr-2.5',
          },
        },
        trailing: { pointer: '' },
      },
    }"
    :placeholder="placeholder ?? 'Your Email'"
    @input="handleInput"
    @paste="handlePaste"
  >
    <template #leading>
      <img class="w-full" src="/images/auth/user.svg" />
    </template>
  </UInput>
</template>
