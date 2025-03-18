<script setup lang="ts">
const { fields, errors, isLoading, isValidate, login } = useSignIn()
const router = useRouter()
</script>
<template>
  <div class="flex flex-row justify-between w-full relative bg-white overflow-hidden p-5 min-h-screen">
    <div
      class="w-7/12 relative rounded-lg bg-[#d6d8e5]/50 overflow-hidden flex flex-col justify-between align-middle p-10"
    >
      <!-- DON'T DELETE THE DIV -->
      <div></div>
      <!-- DON'T DELETE THE DIV -->
      <div class="auth__left-logo">
        <img class="w-[30%]" src="/images/auth/logo.svg" />
      </div>
      <div class="auth__left-title justify-start text-[#1b1c23] text-5xl font-bold font-['Manrope'] leading-[60px]">
        Make your spending<br />Smarter & Faster.
      </div>
      <div class="auth__left-banner">
        <img class="w-[65%] translate-x-[-50px]" src="/images/auth/banner.svg" />
      </div>
      <div class="auth__left-subtitle justify-start text-[#7a7c89] text-md font-semibold font-['Manrope'] leading-7">
        Global corporate cards, expense management, reimbursements, <br />
        travel, and bill pay — all in one.
      </div>
      <!-- DON'T DELETE THE DIV -->
      <div></div>
      <!-- DON'T DELETE THE DIV -->
    </div>
    <div class="w-5/12 flex flex-col justify-between items-center p-5">
      <!-- DON'T DELETE DIV -->
      <div></div>
      <div></div>
      <div></div>
      <!-- DON'T DELETE DIV -->
      <div class="auth__right_head flex flex-col gap-2">
        <div
          class="auth__right-title text-center justify-center text-[#1b1c23] text-[32px] font-bold font-['Manrope'] leading-[44px]"
        >
          Sign in to Wealify
        </div>
        <div
          class="auth__right-subtitle text-center justify-start text-[#7a7c89] text-sm font-medium font-['Manrope'] leading-tight"
        >
          Unlock the power of secure and <br />
          convenient money transfers
        </div>
      </div>
      <div class="auth__right_input flex flex-col gap-3 md:w-[100%] lg:w-[65%]">
        <div class="auth__right-email inline-flex flex-col justify-center items-start gap-1">
          <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium font-['Manrope'] leading-tight">Email</div>
          <AuthEmailInput v-model="fields.email" :error="errors.email" />
          <div
            v-if="errors.email"
            class="h-5 justify-center text-[#ec2c37] text-xs font-medium font-['Manrope'] leading-tight"
          >
            {{ errors.email }}
          </div>
        </div>
        <div class="auth__right-password inline-flex flex-col justify-center items-start gap-1">
          <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium font-['Manrope'] leading-tight">
            Password
          </div>
          <AuthPasswordInput v-model="fields.password" :error="errors.password" />
          <div
            v-if="errors.password"
            class="h-5 justify-center text-[#ec2c37] text-xs font-medium font-['Manrope'] leading-tight"
          >
            {{ errors.password }}
          </div>
          <div class="w-full flex flex-row justify-end mt-2">
            <div class="auth__right-forgot-password cursor-pointer">
              <div
                @click="() => router.push('/auth/forgot')"
                class="text-right justify-center text-[#ff5524] text-xs font-semibold font-['Manrope'] leading-tight"
              >
                Forgot Password?
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="auth__right_button md:w-[100%] flex flex-col gap-2 lg:w-[65%]">
        <AuthSubmitButton
          :title="'Log In'"
          :loading="isLoading"
          :disabled="!isValidate"
          @click="isValidate && login()"
        />
      </div>
      <!-- DON'T DELETE THE DIV -->
      <div></div>
      <div></div>
      <div></div>
      <!-- DON'T DELETE THE DIV -->
    </div>
  </div>
</template>
