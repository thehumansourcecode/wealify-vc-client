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

const errorCount= useCookie(`errorCount`)
const totalSeconds = useCookie('totalSeconds')
const interval = ref(null)
const pinInput = ref(null)

const getCountdownTimer = computed(() => {
  let m = Math.floor(totalSeconds.value / 60)
  let s = totalSeconds.value % 60
  s = s < 10 ? `0${s}` : s
  if (m == 0 && s == `00`){
    errorCount.value = 0
    clearInterval(interval.value)
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
          totalSeconds.value = 5 // relplace time (s)
          interval.value = setInterval(async () => {
            totalSeconds.value--
          }, 1000)
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

const init = ()=>{
  errorCount.value = 0
  countDownTime.value = 30
  totalSeconds.value = 0
}

const resendOtp = async ()=>{
  isLoading.value = true
  await cardStore.sendOtpMessage()
  isLoading.value = false
  countDownTime.value = 30
}

onMounted(async () => {
  init()
  errorCount.value = 0
  await cardStore.sendOtpMessage()
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
})
</script>

<template>

<UModal
    :prevent-close="true"
    class="modal"
    @close-prevented="onClosePrevented"
    :ui="{
      overlay: {
        background: 'bg-[#1c1d23]/30',
      },
      rounded: 'rounded-xl',
      background: '',
      width: 'w-[max-content] sm:max-w-[516px]',
      margin: 'sm:my-0',
    }"
  >
    <div class="p-8 bg-white rounded-[20px] flex flex-col gap-7">
      <div class="w-full flex flex-row justify-between items-center">
        <div class="text-20-600-32">{{ t('cards.modals.otp.title') }}</div>
        <img
          class="cursor-pointer hover:opacity-70"
          src="~/assets/img/common/close.svg"
          alt=""
          @click="handleClose()"
        />
      </div>
     

      <template  v-if="errorCount < 5">
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
        ref="pinInput"
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
      <div class="text-[#ED2C38] text-12-500-20 -mt-[14px]" v-if="errorCount > 0">{{ t('cards.modals.otp.message',{ count: 5 - errorCount})  }}</div>
        <div class="mt-[24px] ml-auto flex flex-row manrope items-center text-14-500-20 gap-0.5">
          <span class="text-[#1C1D23]">{{ t('cards.modals.otp.notReceived') }}</span>
          <template v-if="getCountDownTime">
            <span  class="text-14-600-20 text-[#7A7D89]">{{ t('cards.modals.otp.resend') }}</span>
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
    </template>

      <div class="flex flex-col " v-else>
        <div  class="text-14-600-20 text-[#7A7D89] mb-7">{{ t('cards.modals.otp.max_attemp')  }}</div>
        <UButton
          class="flex self-end text-center justify-center  py-3 px-4 !bg-[#A5A8B8] !hover:bg-[#A5A8B8] rounded-[49px] mx-auto w-[min-content] m-0 min-w-[140px]"
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
