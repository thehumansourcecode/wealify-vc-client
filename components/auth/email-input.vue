<script setup lang="ts">
const { error } = defineProps<{
  error?: string | undefined
}>()

// Use defineModel to create a two-way binding for the 'value' prop
const email = defineModel<string>('value', { default: '' })

const emailRef = ref<HTMLInputElement>()

// Handle input event with typed event parameter
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string = target.value
  // Remove leading and trailing spaces
  value = value.trim()
  // Update email value
  email.value = value
}

// Handle paste event with typed event parameter
const handlePaste = (event: ClipboardEvent) => {
  const pastedText: string = (event.clipboardData || (window as any).clipboardData).getData('text')
  // If length exceeds 128, truncate from the 129th character
  if (pastedText.length > 128) {
    // event.preventDefault()
    email.value = pastedText.substring(0, 128).trim()
  } else {
    email.value = pastedText.trim()
  }
}

// Force update if reactivity fails
watch(email, (newValue: string) => {
  if (emailRef.value && emailRef.value.input) {
    emailRef.value.input.value = newValue
  }
})
</script>
<template>
  <UInput
    ref="emailRef"
    class="w-full"
    variant="none"
    :input-class="
      [
        `input__field self-stretch px-4 py-3.5 rounded-[49px] inline-flex justify-start items-center gap-2.5`,
        `outline outline-[1.50px] outline-offset-[-1.50px]  focus:outline-[#d6d8e5] outline-[#d6d8e5] ${error ? 'outline-[#ec2c37]' : 'outline-[#d6d8e5]'}`,
      ].join(' ')
    "
    :placeholder="'Your Email'"
    @input="handleInput"
    @paste="handlePaste"
  >
    <template #leading>
      <img class="w-full" src="/images/auth/user.svg" />
    </template>
  </UInput>
</template>
