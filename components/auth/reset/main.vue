<script setup lang="ts">
const { step, back, next, isValidate, onCompletedPin, fields, errors, profile } = useReset()
</script>
<template>
  <div class="flex flex-row justify-center w-full relative overflow-hidden min-h-screen">
    <div class="xl:w-5/12 w-full flex flex-col justify-between items-center bg-white p-5">
      <AuthForgotBase
        v-if="step == 1"
        title="Reset your Log in Password"
        subtitle="Please enter your new password"
        :back="back"
      >
        <div class="flex flex-col gap-10 w-[100%] lg:w-[65%]">
          <div class="flex flex-col gap-5">
            <div class="inline-flex flex-col justify-center items-start gap-1">
              <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium leading-tight">Password</div>
              <AuthPasswordInput
                placeholder="Please enter the password"
                v-model="fields.password"
                :error="errors.password"
              />
            </div>
            <AuthPasswordRequirements v-if="!isValidate" :password="fields.password" />
            <div class="inline-flex flex-col justify-center items-start gap-1">
              <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium leading-tight">Confirm Password</div>
              <AuthPasswordInput
                placeholder="Please enter the password again"
                v-model="fields.confirmPassword"
                :error="errors.confirmPassword"
              />
              <div class="h-5 justify-center text-[#ec2c37] text-xs font-medium leading-tight">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>
          <AuthSubmitButton @click="isValidate && next()" :disabled="!isValidate" :title="'Next'" />
        </div>
      </AuthForgotBase>
      <AuthForgotBase
        v-if="step == 2"
        title="Reset your Log in Password"
        :subtitle="`Please enter the verification code sent to ${maskEmail(profile?.email ?? '')}`"
        :back="back"
      >
        <template #subtitle2>
          <div class="text-center justify-start">
            <span class="text-[#7a7c89] text-sm font-medium leading-tight">Your verification code will expire in </span
            ><span class="text-[#ff5524] text-sm font-semibold leading-tight">90s</span>
          </div>
        </template>
        <div class="flex flex-col gap-2 w-[100%] lg:w-[65%]">
          <AuthPinInput v-model="fields.pin" :on-complete="onCompletedPin" />
          <div class="self-stretch justify-start text-[#ec2c37] text-xs font-medium leading-tight">
            {{ errors.pin }}
          </div>
        </div>
        <div class="flex flex-col gap-2 w-[100%] lg:w-[65%]">
          <div class="text-center justify-start">
            <span class="text-[#1b1c23] text-sm font-medium leading-tight">Did not receive OTP?</span
            ><span class="text-[#7a7c89] text-sm font-medium leading-tight"> Resend OTP in </span>
            <AuthCountdown :target="60">
              <template #countdown="{ time }">
                <span class="text-[#ff5524] text-sm font-semibold leading-tight">{{ time }}s</span>
              </template>
            </AuthCountdown>
          </div>
        </div>
      </AuthForgotBase>
    </div>
  </div>
</template>
