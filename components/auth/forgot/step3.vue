<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const passwordError = ref<string>('Hello')
const password = ref<string>()
const confirmPassword = ref<string>()
const confirmPasswordError = ref<string>('Hello')

defineProps<{
  back: () => void;
  next: () => void;
}>()
</script>
<template>
  <AuthForgotBase title="Reset your Log in Password" subtitle="Please enter your registered email" :back="back">
    <div class="auth__right_input flex flex-col gap-5 w-[100%] lg:w-[65%]">
      <div class="auth__right-email inline-flex flex-col justify-center items-start gap-1">
        <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium font-['Manrope'] leading-tight">Password</div>
        <AuthPasswordInput v-model="password" :error="passwordError" />
        <AuthPasswordRequirements :password="password" />
      </div>
      <div class="auth__right-email inline-flex flex-col justify-center items-start gap-1">
        <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium font-['Manrope'] leading-tight">
          Confirm Password
        </div>
        <AuthPasswordInput v-model="confirmPassword" :error="confirmPasswordError" />
        <div
          v-if="confirmPasswordError"
          className="h-5 justify-center text-[#ec2c37] text-xs font-medium font-['Manrope'] leading-tight"
        >
          {{ confirmPasswordError }}
        </div>
      </div>
      <div class="auth__right_button">
        <AuthSubmitButton @click="next()" :title="'Next'" />
      </div>
    </div>
  </AuthForgotBase>
</template>
