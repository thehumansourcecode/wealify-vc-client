<script setup lang="ts">
const cardStore = useCardStore()
const {
  isPreventClose
} = storeToRefs(cardStore)
const profileStore = useProfileStore()
const { t } = useI18n()
const selectedCard = computed(() => cardStore.selectedCardDetail)
const countDownTime = ref(0)
const isLoading = ref(false)

async function handleCompleteInput(value: string) {
  if (value) {
    await cardStore.verifyOTPSensitiveDetail(value)
  }
}

const handleClose = () =>{
  cardStore.toggleSensitiveOTPModal(false)
  isPreventClose.value = false
}

const getCountDownTime = computed(()=>{
  setTimeout(() => {
    countDownTime.value =  countDownTime.value > 0 ? countDownTime.value - 1:countDownTime.value
  }, 1000)
  return countDownTime.value
})

const init = ()=>{
  countDownTime.value = 30
}

const resendOtp = async ()=>{
  isLoading.value = true
  await cardStore.sendOtpMessage()
  isLoading.value = false
  countDownTime.value = 30
}

onMounted(init)
</script>

<template>
  <BaseModal :label="t('cards.modals.otp.title')" @close-prevented="handleClose">
    <div class="text-14-500-20 manrope">
      <div class="flex flex-row gap-0.5">
        <span class="text-[#7a7d89]">{{ t('cards.modals.otp.description') }}</span>
        <span class="text-[#1c1d23]">{{ maskEmail(profileStore.profile?.email || '') }}</span>
      </div>
      <div class="flex flex-row gap-0.5">
        <span class="text-[#7a7d89]">{{ t('cards.modals.otp.timeout') }}</span>
        <!-- Countdown -->
        <span class="text-14-600-20 text-[#FF5524]">90s</span>
      </div>
    </div>
    <PinInput
      class="flex flex-row justify-between gap-1"
      :input-classes="[
        'w-[68px] h-[68px] relative rounded-[49px] text-center justify-center p-2',
        'border-[1.50px] focus:border-[#ec2c37] border-[#d6d8e5]',
        `text-[#1b1c23] text-2xl font-semibold leading-9`,
      ]"
      input-type="number"
      input-mode="numeric"
      :num-inputs="6"
      :should-auto-focus="true"
      :should-focus-order="true"
      :placeholder="[]"
      @on-complete="handleCompleteInput"
    />
    <div class="mt-[52px] ml-auto flex flex-row manrope items-center text-14-500-20 gap-0.5">
      <span class="text-[#7a7d89]">{{ t('cards.modals.otp.notReceived') }}</span>
      <template  v-if="getCountDownTime">
        <span>{{ t('cards.modals.otp.resend') }}</span>
        <span class="text-14-600-20 text-[#FF5524]">{{ getCountDownTime }}s</span>
      </template>
      <UButton
      v-else
       @click="resendOtp"
       :loading="isLoading"
        class="flex items-center py-[4px] px-3 !bg-[#FF5524] !hover:bg-[#FF5524] rounded-[44px] mx-auto w-[min-content] m-0"
      >
      {{ t('cards.modals.otp.button.resend') }}
      </UButton>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
