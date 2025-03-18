<script setup lang="ts">
const { step, back, next } = useForgot()
</script>
<template>
  <div class="flex flex-row justify-center w-full relative overflow-hidden min-h-screen">
    <div class="xl:w-5/12 w-full flex flex-col justify-between items-center bg-white p-5">
      <AuthForgotStep1 v-if="step == 1" :back="back" :next="next" />
      <AuthForgotStep2 v-if="step == 2" :back="back" :next="next" />
      <AuthForgotStep3 v-if="step == 3" :back="back" :next="next" />
    </div>
  </div>
</template>
