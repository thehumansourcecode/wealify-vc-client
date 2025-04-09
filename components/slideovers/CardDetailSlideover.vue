<script setup lang="ts">
import { TransactionStatus, TransactionType } from '~/types/dashboard'
import { formatMMYYYY, formatMoney, shortenAddress, formatMoneyWithoutDecimals, roundNumber } from '~/common/functions'
import { CardStatus } from '~/types/cards'
import { CommonCurrency } from '~/types/common'
import { showToast, ToastType } from '~/common/functions'
const { copy, copied } = useClipboard()

const { t } = useI18n()
const toast = useToast()

const dayjs = useDayjs()

const copyIndex = ref(0)

function handleCopy(index: number, value: string) {
  copyIndex.value = index
  copy(value)
  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

const cardStore = useCardStore()
const transactionStore = useTransactionStore()
const {isOpenCardDetailSlideover} =  storeToRefs(cardStore)
const cardDetail = computed(() => cardStore.selectedCardDetail)
const isShowCardSensitiveDetail = computed(() => cardStore.isShowCardSensitiveDetail)
const isShowCardSensitiveDetailOverlay = ref(false)
const _x = ref(0)
const _y = ref(0)

const cardSensitiveDetail = computed(() => cardStore.cardSensitiveDetail)

const cardNumberArray = computed(() => cardSensitiveDetail.value?.card_number?.match(/.{1,4}/g))

const balanceRate = computed(() => {
if (!cardDetail.value?.total_withdraw){
  return 0
}
return  cardDetail.value?.total_top_up
      ? roundNumber(((cardDetail.value?.total_withdraw) / cardDetail.value?.total_top_up) * 100, 1)
      : 0
})

const chartClass = computed(() => {
  return `background: conic-gradient(#FF5524 0% ${balanceRate.value}%, #D7D9E5 ${balanceRate.value}% 100%)`
})

const chartContainer = ref(null)
const isWithdrawTooltipVisible = ref(false)
const isBalanceTooltipVisible = ref(false)

// Handle mouse movement to detect hover over total_withdraw section
const handleMouseMove = event => {
  const rect = chartContainer.value?.getBoundingClientRect()
  const x = event.clientX - rect.left - 64
  const y = event.clientY - rect.top - 64
  _x.value = x
  _y.value = y
  const distance = Math.sqrt(x * x + y * y)
  const angle = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360 // Convert to degrees, 0-360
  const adjusted_angle = (angle + 90) % 360 // Shift to start from north
  const theta = (balanceRate?.value || 0) * 3.6 // Convert percentage to degrees (100% = 360°)
  // Check if mouse is within the ring (r_inner=54, r_outer=64) and total_withdraw angle
  if (distance >= 54 && distance <= 64 && adjusted_angle <= theta) {
    isWithdrawTooltipVisible.value = true
  } else {
    isWithdrawTooltipVisible.value = false
  }
  if (distance >= 54 && distance <= 64 && adjusted_angle >= theta) {
    isBalanceTooltipVisible.value = true
  } else {
    isBalanceTooltipVisible.value = false
  }
}


const styleTooltipWithDraw =  computed(() => {
  let top,left
  if (isWithdrawTooltipVisible.value){
    top = _y.value + 60
    left = _x.value + 75
  }else{
    top = 64
    left = 64
  }

  return `top:${top}px;left:${left}px;transition: all 0.1s ease-in-out;`
})

const styleTooltipBalance =  computed(() => {
  let top,left
  if (isBalanceTooltipVisible.value){
    top = _y.value + 60
    left = _x.value + 80
  }else{
    top = 64
    left = 64
  }
  return `top:${top}px;left:${left}px; transition: all 0.1s ease-in-out;`
})

async function handleShowSensitiveDetail() {
  // TODO: Handle OTP send to email request
  // await cardStore.sendOTPSensitiveDetail()
  cardStore.toggleSensitiveOTPModal(true)
}

function onClosePrevented() {
  cardStore.toggleCardDetailSlideover(false)
}

function handleViewTransaction() {
  cardStore.toggleCardDetailSlideover(false)
  const payload = transactionStore.payload
  transactionStore.setPayload({ ...payload, keyword: cardDetail.value?.last_four })
  navigateTo('/transactions')
}

const showCardSensitiveDetailOverlay = computed(()=>{
  return cardDetail.value.card_status !== CardStatus.FROZEN
})

// Actions
function handleTopup() {
  cardStore.toggleCardDetailSlideover(false)
  cardStore.toggleCardTopupModal(true)
}

const handleFreeze = async () => {
  // cardStore.toggleCardDetailSlideover(false)
  cardStore.toggleCardFreeze(true)
}

const handleCancel = async () => {
  // cardStore.toggleCardDetailSlideover(false)
  cardStore.toggleCardCancel(true)
}

function handleWithdraw() {}

const handleUnfreeze = async () => {
  // cardStore.toggleCardDetailSlideover(false)
  cardStore.toggleCardUnFreeze(true)
}

function handleEdit() {
  cardStore.toggleCardDetailSlideover(false)
  cardStore.toggleCardEditModal(true)
}

</script>

<template>
  <USlideover
    v-model="isOpenCardDetailSlideover"
    :ui="{
      width: 'w-screen max-w-[464px]',
      overlay: {
        background: 'bg-[#1c1d23]/30',
      },
    }"
  >
    <div class="flex flex-col items-center bg-[#1C1D23]">
      <div class="w-full flex flex-row items-center py-6 px-8 justify-between">
        <div class="flex flex-row gap-4 items-center">
          <img
            class="cursor-pointer hover:opacity-80"
            src="~/assets/img/icons/back-dark.svg"
            alt=""
            @click="onClosePrevented()"
          />
          <div class="text-20-600-32 text-[#FFF]">
            {{ t(`cards.slideovers.detail.label`) }}
          </div>
        </div>
        <img
          v-if="cardDetail?.card_status === CardStatus.ACTIVE"
          class="cursor-pointer hover:opacity-80"
          src="~/assets/img/icons/edit.svg"
          alt=""
          @click="handleEdit()"
        />
      </div>
      <div class="flex flex-col slideover-content overflow-y-auto w-full">
        <!-- Card -->
        <div
          class="w-[400px] h-[220px] rounded-[21px] flex flex-none flex-col items-start bg-[url(~/assets/img/cards/card-bg.svg)] bg-right pt-[18px] pb-6 pl-5 pr-10 mx-8 mb-8"
        >
          <div class="flex flex-row gap-3">
            <img src="~/assets/img/cards/card-logo.svg" alt="" />
            <div
              class="px-3 py-[2px] flex items-center justify-center rounded-[5px] gap-1 border border-[#FFFFFF33] max-w-[180px]"
            >
              <div class="text-[#FFF] text-12-500-20">{{ t(`cards.list.category.${cardDetail?.category}`) }}</div>
              <img :src="`/icons/cards/category/${cardDetail?.category}.svg`" alt="" />
            </div>
          </div>
          <div v-if="cardDetail?.card_status === CardStatus.CANCELLED" class="pull-left mt-auto ml-0 mb-3 w-[76px] h-[24px] gap-[6px] bg-[#FFE3EF] items-center justify-center mx-auto px-3 py-[2px] rounded-[110px] flex flex-row">
            <div class="text-12-500-20 text-[#ED2C38]">
              {{ t(`cards.list.status.${cardDetail?.card_status}`) }}
            </div>
            <div class="w-[6px] h-[6px] rounded-[1px] bg-[#ED2C38]"></div>
          </div>
          <img v-else class="mt-auto mb-3 w-[110px]" src="~/assets/img/cards/add-to-apple.png" alt="" />
          <div class="karla tracking-[3px] text-24-400 text-[#D7D9E5] w-full">
            <div class="flex flex-row justify-between w-full" v-if="isShowCardSensitiveDetail">
              <div v-for="(part, index) in cardNumberArray" :key="index">
                {{ part }}
              </div>
            </div>
            <div class="flex flex-row justify-between w-full" v-else>
              <div>XXXX</div>
              <div>XXXX</div>
              <div>XXXX</div>
              <div>{{ cardDetail?.last_four }}</div>
            </div>
          </div>
        </div>
        <!-- Information -->
        <div class="bg-white grow px-8 pt-4 pb-9 rounded-t-[20px] flex flex-col">
          <div class="text-[#1C1D23] text-20-500-32 uppercase">{{ cardDetail?.card_name }}</div>
          <div class="mt-2 flex flex-row gap-8">
            <div class="flex flex-row gap-2">
              <img src="~/assets/img/icons/mail.svg" alt="" />
              <div class="text-[#7A7D89] text-14-500-20">{{ cardDetail?.email }}</div>
            </div>
            <div class="flex flex-row gap-2">
              <img src="~/assets/img/icons/phone.svg" alt="" />
              <div class="text-[#7A7D89] text-14-500-20">{{ cardDetail?.phone_number }}</div>
            </div>
          </div>
          <!-- Buttons -->
          <div
            v-if="cardDetail?.card_status === CardStatus.ACTIVE"
            class="mt-7 flex flex-row w-full justify-around text-[#1C1D23] text-14-500-20"
          >
            <div @click="handleTopup" class="flex flex-col gap-3 items-center cursor-pointer hover:opacity-90">
              <img class="w-10" src="~/assets/img/cards/topup.svg" alt="" />
              <div>{{ t(`cards.slideovers.detail.button.topup`) }}</div>
            </div>
            <div @click="handleFreeze" class="flex flex-col gap-3 items-center cursor-pointer hover:opacity-90">
              <img class="w-10" src="~/assets/img/cards/freeze.svg" alt="" />
              <div>{{ t(`cards.slideovers.detail.button.freeze`) }}</div>
            </div>
            <div @click="handleCancel" class="flex flex-col gap-3 items-center cursor-pointer hover:opacity-90">
              <img class="w-10" src="~/assets/img/cards/cancel.svg" alt="" />
              <div>{{ t(`cards.slideovers.detail.button.cancel`) }}</div>
            </div>
            <div @click="handleWithdraw" class="flex flex-col gap-3 items-center cursor-pointer hover:opacity-90">
              <img class="w-10" src="~/assets/img/cards/withdraw.svg" alt="" />
              <div>{{ t(`cards.slideovers.detail.button.withdraw`) }}</div>
            </div>
          </div>
          <div v-if="cardDetail?.card_status === CardStatus.FROZEN" class="mt-7 flex flex-row w-full justify-between">
            <div
              @click="handleUnfreeze"
              class="flex flex-col gap-3 w-[50%] items-center cursor-pointer hover:opacity-90"
            >
              <img class="w-10" src="~/assets/img/cards/unfreeze.svg" alt="" />
              <div>{{ t(`cards.slideovers.detail.button.unfreeze`) }}</div>
            </div>
            <div @click="handleCancel" class="flex flex-col gap-3 w-[50%] items-center cursor-pointer hover:opacity-90">
              <img class="w-10" src="~/assets/img/cards/cancel.svg" alt="" />
              <div>{{ t(`cards.slideovers.detail.button.cancel`) }}</div>
            </div>
          </div>
          <!-- Detail -->
          <div
            class="px-5 bg-[#F0F2F5] flex flex-col rounded-[12px] mt-7 py-4 gap-6 relative"
            @mouseenter="isShowCardSensitiveDetailOverlay = true"
            @mouseleave="isShowCardSensitiveDetailOverlay = false"
          >
            <transition name="fade-overlay" v-if="showCardSensitiveDetailOverlay">
              <div
                v-if="!isShowCardSensitiveDetail && isShowCardSensitiveDetailOverlay"
                class="absolute top-0 left-0 h-full w-full rounded-[12px] backdrop-blur-[2px] bg-[#f0f2f54d] flex items-center justify-center"
              >
                <div
                  @click="handleShowSensitiveDetail"
                  class="bg-white px-4 py-2 flex flex-row gap-[10px] hover:opacity-90 cursor-pointer rounded-[110px]"
                >
                  <div class="text-12-600-20">{{ t(`cards.slideovers.detail.button.viewInfo`) }}</div>
                  <img src="~/assets/img/common/eye.svg" alt="" />
                </div>
              </div>
            </transition>
            <div class="flex flex-row justify-between text-14-500-20 text-[#1C1D23]">
              <div>{{ t(`cards.slideovers.detail.info.card_number`) }}</div>
              <div v-if="isShowCardSensitiveDetail" class="flex flex-row gap-2 items-center">
                <div class="flex flex-row gap-1">
                  <div v-for="(part, index) in cardNumberArray" :key="index">
                    {{ part }}
                  </div>
                </div>

                <img
                  class="cursor-pointer"
                  @click="handleCopy(0, cardSensitiveDetail?.card_number || '')"
                  :src="
                    copied && copyIndex === 0 ? `/icons/common/copied-bordered.svg` : `/icons/common/copy-bordered.svg`
                  "
                  alt=""
                />
              </div>
              <div v-else>**** **** **** {{ cardDetail?.last_four }}</div>
            </div>
            <div class="flex flex-row justify-between text-14-500-20">
              <div class="text-[#7A7D89]">{{ t(`cards.slideovers.detail.info.CVV`) }}</div>
              <div v-if="isShowCardSensitiveDetail" class="flex flex-row gap-2 items-center">
                <span>{{ cardSensitiveDetail?.cvv || 'CVV' }}</span>
                <img
                  class="cursor-pointer"
                  @click="handleCopy(1, cardSensitiveDetail?.cvv || 'CVV')"
                  :src="
                    copied && copyIndex === 1 ? `/icons/common/copied-bordered.svg` : `/icons/common/copy-bordered.svg`
                  "
                  alt=""
                />
              </div>
              <div v-else>***</div>
            </div>
            <div class="flex flex-row justify-between text-14-500-20">
              <div class="text-[#7A7D89]">{{ t(`cards.slideovers.detail.info.expired`) }}</div>
              <div class="flex flex-row gap-2 items-center">
                <div>{{ cardDetail?.expiry_date }}</div>
                <img
                  v-if="isShowCardSensitiveDetail && cardDetail?.expiry_date"
                  class="cursor-pointer"
                  @click="handleCopy(2, cardDetail?.expiry_date)"
                  :src="
                    copied && copyIndex === 2 ? `/icons/common/copied-bordered.svg` : `/icons/common/copy-bordered.svg`
                  "
                  alt=""
                />
              </div>
            </div>
            <div class="flex flex-row justify-between text-14-500-20">
              <div class="text-[#7A7D89]">{{ t(`cards.slideovers.detail.info.cardBalance`) }}</div>
              <div>{{ formatMoneyWithoutDecimals(cardDetail?.balance, CommonCurrency.USD) }}</div>
            </div>
          </div>
          <!-- Analysis -->
          <div class="flex flex-row justify-between items-center mt-7 gap-8 mb-12">
            <div
              class="w-[128px] h-[128px] relative flex-none"
              ref="chartContainer"
              @mousemove="handleMouseMove"
              @mouseleave="isWithdrawTooltipVisible = false;isBalanceTooltipVisible = false"
            >
              <div class="chart flex items-center justify-center z-100" :style="chartClass">
                <div class="balance-rate">{{ balanceRate }}%</div>
              </div>
              <div
                v-if="isWithdrawTooltipVisible && cardDetail?.total_withdraw"
                :style="styleTooltipWithDraw"
                class="absolute -translate-y-1/2  bg-[#1C1D23] py-2 px-3 flex flex-row items-center gap-[6px] rounded-[8px]"
              >
                <div class="absolute top-1/2 left-[-5px] transform -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-transparent border-r-black"></div>
                <div class="bg-[#FF5524] w-2 h-2 mx-[3px] rounded-full"></div>
                <div class="w-[85px] text-[#A5A8B8] text-10-500-14">
                  {{ t(`cards.slideovers.detail.info.total_withdraw`) }}
                </div>
                <div class="ml-auto text-[#FFF] text-14-500-20">
                  ${{ formatMoneyWithoutDecimals(cardDetail?.total_withdraw) }}
                </div>
              </div>

              <div
                v-if="isBalanceTooltipVisible"
                :style="styleTooltipBalance"
                class="absolute  bg-[#1C1D23] py-2 px-3 flex flex-row items-center gap-[6px] rounded-[8px]"
              >
                <div class="absolute top-1/2 left-[-5px] transform -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-transparent border-r-black"></div>
                <div class="bg-[#D7D9E5] w-2 h-2 mx-[3px] rounded-full"></div>
                <div class="w-[85px] text-[#A5A8B8] text-10-500-14">
                  {{ t(`cards.slideovers.detail.info.balance`) }}
                </div>
                <div class="ml-auto text-[#FFF] text-14-500-20">
                  ${{ formatMoneyWithoutDecimals(cardDetail?.balance) }}
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-4 text-[#7A7D89] text-12-500-20 grow">
              <div class="flex flex-row gap-4">
                <img src="~/assets/img/cards/purpose.svg" alt="" />
                <div class="ml-1.5 w-[85px] flex-none">{{ t(`cards.slideovers.detail.info.purpose`) }}</div>
                <BaseTruncatedTooltip class="ml-auto text-right max-w-[100px]" :text="cardDetail?.card_purpose" />
              </div>
              <div class="flex flex-row items-center gap-4">
                <div class="bg-[#D7D9E5] w-2 h-2 mx-[3px] rounded-full"></div>
                <div class="ml-1.5 w-[85px]">{{ t(`cards.slideovers.detail.info.total_top_up`) }}</div>
                <div class="ml-auto text-[#1C1D23] text-14-500-20">
                  ${{ formatMoneyWithoutDecimals(cardDetail?.total_top_up) }}
                </div>
              </div>
              <div class="flex flex-row items-center gap-4">
                <div class="bg-[#FF5524] w-2 h-2 mx-[3px] rounded-full"></div>
                <div class="ml-1.5 w-[85px]">{{ t(`cards.slideovers.detail.info.total_withdraw`) }}</div>
                <div class="ml-auto text-[#1C1D23] text-14-500-20">
                  ${{ formatMoneyWithoutDecimals(cardDetail?.total_withdraw) }}
                </div>
              </div>
            </div>
          </div>
          <!-- Actions -->
          <UButton
            @click="handleViewTransaction"
            class="flex items-center justify-center w-[400px] bg-[#1C1D23] hover:bg-[#3D3E34] rounded-[49px]"
          >
            <div class="text-white text-14-600-20 px-4 py-[14px]">
              <div>{{ t(`cards.slideovers.detail.button.transaction`) }}</div>
            </div>
          </UButton>
        </div>
      </div>
    </div>
  </USlideover>
</template>

<style lang="scss" scoped>
.slideover-content {
  max-height: calc(100vh - 80px);
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.8s ease;
}

/* Start or end state of the transition */
.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

.chart {
  /* Make a perfect circle */
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 50%;
}

/* Pseudo-element to create the inner circle (the 'hole') */
.chart::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: #fff; /* Or any background color to fill the center */
}

.balance-rate {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
