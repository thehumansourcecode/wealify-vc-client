<script setup lang="ts">
const show = ref<boolean>(false)

/// Props
const { error } = defineProps<{
  error?: string | undefined
  placeholder?: string | undefined
}>()

// Use defineModel to create a two-way binding for the 'value' prop
const password = defineModel<string>('value', { default: '' })

const passwordRef = ref<any>()

// Handle input event
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string = target.value
  // Remove all spaces (leading, trailing, and internal)
  value = value.replace(/\s/g, '')

  // Update password value
  password.value = value
  if (passwordRef.value && passwordRef.value.input) {
    passwordRef.value.value = password.value
    passwordRef.value.input.value = password.value
  }
}

// Handle paste event
const handlePaste = (event: ClipboardEvent) => {
  const pastedText: string = (event.clipboardData || (window as any).clipboardData).getData('text')
  // Remove all spaces
  const cleanedText = pastedText.replace(/\s/g, '')

  // Truncate to 16 characters if necessary
  const truncatedText = cleanedText.substring(0, 16)

  // Prevent default paste behavior and set cleaned value
  // event.preventDefault()
  password.value = truncatedText
  // if (passwordRef.value && passwordRef.value.input) {
  //   passwordRef.value.value = password.value
  //   passwordRef.value.input.value = password.value
  // }
}
</script>
<template>
  <UInput
    ref="passwordRef"
    class="w-full"
    variant="none"
    :type="show ? 'text' : 'password'"
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
    :placeholder="placeholder ?? 'Your Password'"
    maxlength="16"
    minlength="8"
    @input="handleInput"
    @paste="handlePaste"
  >
    <template #leading>
      <img class="w-full" src="/images/auth/lock.svg" />
    </template>
    <template #trailing>
      <div class="styled-text-button pr-1 text-[10px]" @click="show = !show" alt="">
        {{ show ? 'Hide' : 'Show' }}
      </div>
    </template>
  </UInput>
</template>
