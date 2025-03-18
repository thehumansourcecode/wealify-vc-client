<script setup lang="ts">
const { step, back, next, fields, errors } = useForgot()
</script>
<template>
  <div class="flex flex-row justify-center w-full relative overflow-hidden min-h-screen">
    <div class="xl:w-5/12 w-full flex flex-col justify-between items-center bg-white p-5">
      <AuthForgotBase
        v-if="step == 1"
        title="Reset your Log in Password"
        subtitle="Please enter your registered email"
        :back="back"
      >
        <div class="auth__right_input flex flex-col gap-10 w-[100%] lg:w-[65%]">
          <div class="auth__right-email inline-flex flex-col justify-center items-start gap-1">
            <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium font-['Manrope'] leading-tight">
              Email
            </div>
            <AuthEmailInput v-model="fields.email" :error="errors.email" />
            <div
              v-if="errors.email"
              className="h-5 justify-center text-[#ec2c37] text-xs font-medium font-['Manrope'] leading-tight"
            >
              {{ errors.email }}
            </div>
          </div>
          <div class="auth__right_button">
            <AuthSubmitButton
              @click="!errors.email && fields.email && next()"
              :disabled="errors.email || !fields.email"
              :title="'Next'"
            />
          </div>
        </div>
      </AuthForgotBase>
      <AuthForgotBase
        v-if="step == 2"
        title="Reset your Log in Password"
        subtitle="Please enter your registered email"
        :back="back"
      >
        <div class="auth__right_input flex flex-col gap-2 w-[100%] lg:w-[65%]">
          <AuthPinInput v-model="fields.pin" />
          <div
            v-if="errors.pin"
            className="self-stretch justify-start text-[#ec2c37] text-xs font-medium font-['Manrope'] leading-tight"
          >
            {{ errors.pin }}
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
      <AuthForgotBase
        v-if="step == 3"
        title="Reset your Log in Password"
        subtitle="Please enter your registered email"
        :back="back"
      >
        <div class="auth__right_input flex flex-col gap-5 w-[100%] lg:w-[65%]">
          <div class="auth__right-email inline-flex flex-col justify-center items-start gap-1">
            <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium font-['Manrope'] leading-tight">
              Password
            </div>
            <AuthPasswordInput v-model="fields.password" :error="errors.password" />
            <AuthPasswordRequirements :password="fields.password" />
          </div>
          <div class="auth__right-email inline-flex flex-col justify-center items-start gap-1">
            <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium font-['Manrope'] leading-tight">
              Confirm Password
            </div>
            <AuthPasswordInput v-model="fields.confirmPassword" :error="errors.confirmPassword" />
            <div
              v-if="errors.confirmPassword"
              className="h-5 justify-center text-[#ec2c37] text-xs font-medium font-['Manrope'] leading-tight"
            >
              {{ errors.confirmPassword }}
            </div>
          </div>
          <div class="auth__right_button">
            <AuthSubmitButton
              @click="next()"
              :disabled="errors.password || !fields.password || errors.confirmPassword || !fields.confirmPassword"
              :title="'Next'"
            />
          </div>
        </div>
      </AuthForgotBase>
    </div>
  </div>
</template>
