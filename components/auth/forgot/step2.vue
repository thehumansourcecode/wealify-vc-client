<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const { next } = defineProps<{
  back: () => void
  next: () => void
}>()

const pin = ref<string>()

watch(pin, () => {
  if (pin.value && pin.value?.length > 5) {
    next()
    return
  }
})
</script>
<template>
  <AuthForgotBase title="Reset your Log in Password" subtitle="Please enter your registered email" :back="back">
    <div class="auth__right_input flex flex-col gap-2 w-[100%] lg:w-[65%]">
      <AuthPinInput v-model="pin" />
      <div className="self-stretch justify-start text-[#ec2c37] text-xs font-medium font-['Manrope'] leading-tight">
        The OTP you entered is invalid or expired.
      </div>
    </div>
    <div class="auth__right_input flex flex-col gap-2 w-[100%] lg:w-[65%]">
      <div className="text-center justify-start">
        <span class="text-[#1b1c23] text-sm font-medium font-['Manrope'] leading-tight">Did not receive OTP?</span
        ><span class="text-[#7a7c89] text-sm font-medium font-['Manrope'] leading-tight"> Resend OTP in </span
        ><span class="text-[#ff5524] text-sm font-semibold font-['Manrope'] leading-tight">30s</span>
      </div>
    </div>
  </AuthForgotBase>
</template>
