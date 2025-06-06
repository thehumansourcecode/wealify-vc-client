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
const pinInput = ref(null)

const countDownStore = useCountDownStore()

const {
  totalSeconds,
  errorCount,
  showCountDown
} = storeToRefs(countDownStore)

const getCountdownTimer = computed(() => {
  let m = Math.floor(totalSeconds.value / 60)
  let s = totalSeconds.value % 60
  s = s < 10 ? `0${s}` : s
  if (m == 0 && s == `00`){
    countDownStore.stop()
    return t('cards.modals.otp.button.try_again')
  }
  return m > 0 ? `${m}m${s}s` : `${s}s`
})


async function handleCompleteInput(value: string) {
  if (value) {
    const result =  await cardStore.verifyOTPSensitiveDetail(value)
    if (!result.success){
      pinInput.value.clearInput()
      errorCount.value++
      if ( errorCount.value == 5){
        errorCount.value = 0
        showCountDown.value = true
        countDownStore.start(1800)
      }
    }
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

const init = async ()=>{
  errorCount.value = 0
  countDownTime.value = 30
  if (showCountDown.value){
    countDownStore.resume()
    return
  }
  await cardStore.sendOtpMessage()
}

const resendOtp = async ()=>{
  isLoading.value = true
  await cardStore.sendOtpMessage()
  isLoading.value = false
  countDownTime.value = 30
}

const tryAgainHandler = ()=>{
  if (totalSeconds.value > 0){
    return
  }
  countDownTime.value = 30
  showCountDown.value = false
  cardStore.sendOtpMessage()
}


onMounted(async () => {
  await init()
})

</script>

<template>
  <UModal
    :prevent-close="true"
    class="modal"
    @close-prevented="onClosePrevented"
    :ui="{
      container: 'flex min-h-full items-center sm:items-center justify-center text-center',
      overlay: {
        background: 'bg-[#1c1d23]/30',
      },
      rounded: 'rounded-xl',
      background: '',
      width: 'w-full sm:max-w-[516px]',
      margin: 'sm:my-0',
    }"
  >
    <div class="p-4 sm:p-8 bg-white rounded-[20px] flex flex-col gap-5 sm:gap-7 w-full">
      <div class="w-full flex flex-row justify-between items-center">
        <div class="text-base sm:text-xl font-semibold">{{ t('cards.modals.otp.title') }}</div>
        <img
          class="cursor-pointer hover:opacity-70 w-5 h-5"
          src="~/assets/img/common/close.svg"
          alt=""
          @click="handleClose()"
        />
      </div>

      <template v-if="!showCountDown">
        <div class="text-14-500-20 manrope">
          <div>
            <span class="text-[#7a7d89]">{{ t('cards.modals.otp.description') }}</span>
            <span class="text-[#1c1d23]">{{ maskEmail(profileStore.profile?.email || '') }}</span>
          </div>
          <div class="flex flex-row gap-1">
            <span class="text-[#7a7d89]">{{ t('cards.modals.otp.timeout') }}</span>
            <span class="font-semibold text-[#FF5524]">{{ 90 }}s</span>
          </div>
        </div>

        <PinInput
          ref="pinInput"
          class="flex flex-wrap justify-between gap-1 mt-4 lg:gap-2"
          :input-classes="[
            'w-12 h-12 sm:w-[68px] sm:h-[68px] rounded-full text-center p-2',
            'border border-[#d6d8e5] focus:border-[#ec2c37]',
            'text-[#1b1c23] text-xl sm:text-2xl font-semibold',
          ]"
          input-type="number"
          input-mode="numeric"
          :num-inputs="6"
          :should-auto-focus="true"
          :should-focus-order="true"
          :placeholder="[]"
          @on-complete="handleCompleteInput"
        />

        <div class="text-[#ED2C38] text-xs sm:text-sm font-medium -mt-2" v-if="errorCount > 0">
          {{ t('cards.modals.otp.message',{ count: 5 - errorCount}) }}
        </div>

        <div class="mt-4 ml-auto flex flex-wrap items-center text-sm font-medium gap-1">
          <span class="text-[#1C1D23]">{{ t('cards.modals.otp.notReceived') }}</span>
          <template v-if="getCountDownTime">
            <span class="text-[#7A7D89]">{{ t('cards.modals.otp.resend') }}</span>
            <span class="text-[#FF5524]">{{ getCountDownTime }}s</span>
          </template>

          <UButton
            v-else
            @click="resendOtp"
            :loading="isLoading"
            class="flex items-center py-1.5 px-3 !bg-[#FF5524] !hover:bg-[#FF5524] rounded-full mx-auto"
          >
            {{ t('cards.modals.otp.button.resend') }}
          </UButton>
        </div>
      </template>

      <div v-else class="flex flex-col">
        <div  class="text-14-600-20 text-[#7A7D89] mb-7">{{ t('cards.modals.otp.max_attemp')  }}</div>
        <UButton
          @click="tryAgainHandler"
          :class="{'!bg-[#FF5524]':!totalSeconds}"
          class="flex self-end text-center justify-center  py-3 px-4 bg-[#A5A8B8] hover:bg-[#A5A8B8] rounded-[49px] mx-auto w-[min-content] m-0 min-w-[140px]"
        >
          <span>{{getCountdownTimer}}</span>
        </UButton>
      </div>
    </div>
  </UModal>
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
