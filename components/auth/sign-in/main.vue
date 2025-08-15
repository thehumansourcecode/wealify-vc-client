<script setup lang="ts">
const { fields, errors, isLoading, isValidate, login } = useSignIn()
const router = useRouter()
</script>
<template>
  <div class="flex flex-col lg:flex-row justify-between w-full relative bg-white overflow-hidden p-4 lg:p-5 min-h-screen">
    <div
      class="hidden lg:flex w-7/12 relative rounded-lg bg-[#d6d8e5]/50 overflow-hidden flex-col justify-between align-middle p-10"
    >
      <!-- DON'T DELETE THE DIV -->
      <div></div>
      <!-- DON'T DELETE THE DIV -->
      <div class="">
        <img class="w-[30%] min-w-[250px]" src="/images/auth/logo.svg" />
      </div>
      <div class="justify-start text-[#1b1c23] text-5xl font-bold leading-[60px]">
        Make your spending<br />Smarter & Faster.
      </div>
      <div class="">
        <img class="w-[65%] translate-x-[-50px]" src="/images/auth/banner.svg" />
      </div>
      <div class="justify-start text-[#7a7c89] text-md font-semibold leading-7">
        Global corporate cards, expense management, reimbursements, <br />
        travel, and bill pay — all in one.
      </div>
      <!-- DON'T DELETE THE DIV -->
      <div></div>
      <!-- DON'T DELETE THE DIV -->
    </div>
    <div class="w-full lg:w-5/12 flex flex-col justify-between items-center p-4 lg:p-5">
      <!-- Logo for mobile -->
      <div class="lg:hidden w-full flex justify-center mb-8">
        <img class="w-[200px]" src="/images/auth/logo.svg" />
      </div>
      <!-- DON'T DELETE DIV -->
      <div></div>
      <div></div>
      <div></div>
      <!-- DON'T DELETE DIV -->
      <div class="flex flex-col gap-2 w-full max-w-[400px]">
        <div class="text-center justify-center text-[#1b1c23] text-2xl lg:text-[32px] font-bold leading-[44px]">
          Sign in to Wealify
        </div>
        <div class="text-center justify-start text-[#7a7c89] text-sm font-medium leading-tight">
          Unlock the power of secure and <br />
          convenient money transfers
        </div>
      </div>
      <div class="flex flex-col gap-2 w-full max-w-[400px]">
        <div class="inline-flex flex-col justify-center items-start gap-1 w-full">
          <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium leading-tight">Email</div>
          <AuthEmailInput v-model="fields.email" :error="errors.email" />
          <div class="h-5 justify-center text-[#ec2c37] text-xs font-medium leading-tight">
            {{ errors.email }}
          </div>
        </div>
        <div class="inline-flex flex-col justify-center items-start gap-1 w-full">
          <div class="h-5 justify-center text-[#1b1c23] text-xs font-medium leading-tight">Password</div>
          <AuthPasswordInput v-model="fields.password" :error="errors.password" />
          <div class="h-5 justify-center text-[#ec2c37] text-xs font-medium leading-tight">
            {{ errors.password }}
          </div>
          <div class="w-full flex flex-row justify-end mt-2">
            <div class="cursor-pointer">
              <div
                @click="() => router.push('/auth/forgot')"
                class="text-right justify-center text-[#ff5524] text-xs font-semibold leading-tight"
              >
                Forgot Password?
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full max-w-[400px] flex flex-col gap-2">
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
