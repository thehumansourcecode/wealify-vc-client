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
}

// Force update if reactivity fails
watch(password, (newValue: string) => {
  if (passwordRef.value && passwordRef.value.input) {
    passwordRef.value.input.value = newValue
  }
})
</script>
<template>
  <UInput
    ref="passwordRef"
    class="w-full"
    variant="none"
    :type="show ? 'text' : 'password'"
    :input-class="
      [
        `input__field self-stretch px-4 py-3.5 rounded-[49px] inline-flex justify-start items-center gap-2.5 `,
        `outline outline-[1.50px] outline-offset-[-1.50px] focus:outline-[#d6d8e5] outline-[#d6d8e5]  ${error ? 'outline-[#ec2c37]' : 'outline-[#d6d8e5]'}`,
      ].join(' ')
    "
    :ui="{
      icon: {
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
      <div
        class="pr-1 justify-center text-[#ff5524] hover:text-[#ff5524] focus:text-[#ff5524] text-[10px] font-medium font-['Manrope'] cursor-pointer"
        @click="show = !show"
        alt=""
      >
        {{ show ? 'Hide' : 'Show' }}
      </div>
    </template>
  </UInput>
</template>
