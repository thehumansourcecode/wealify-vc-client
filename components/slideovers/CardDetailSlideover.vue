<script setup lang="ts">
import { TransactionStatus, TransactionType } from '~/types/dashboard'
import { formatMMYYYY, formatMoney, shortenAddress, formatMoneyWithoutDecimals, roundNumber } from '~/common/functions'
import { CardStatus } from '~/types/cards'
import { CommonCurrency } from '~/types/common'

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
const isOpenCardDetailSlideover = computed(() => cardStore.isOpenCardDetailSlideover)
const cardDetail = computed(() => cardStore.selectedCardDetail)
const isShowCardSensitiveDetail = ref(false)
const isShowCardSensitiveDetailOverlay = ref(false)

const cardSensitiveDetail = ref({
  CVV: '888',
  card_number: '1231 1232 1233 9998',
})

const balanceRate = computed(() =>
  cardDetail.value?.balance
    ? roundNumber(
        ((cardDetail.value?.total_top_up || 0 + (cardDetail.value?.total_withdraw || 0)) / cardDetail.value?.balance) *
          100,
        1,
      )
    : 0,
)

const chartClass = computed(() => {
  return `background: conic-gradient(#FF5524 0% ${balanceRate.value}%, #D7D9E5 ${balanceRate.value}% 100%)`
})

function handleShowSensitiveDetail() {
  // OTP, PIN ...
  isShowCardSensitiveDetail.value = true
  isShowCardSensitiveDetailOverlay.value = false
}

function onClosePrevented() {
  cardStore.toggleCardDetailSlideover(false)
}

function handleViewTransaction() {
  cardStore.toggleCardDetailSlideover(false)
  // Set payload => filter transactions only current card
  navigateTo('/transactions')
}

// Actions
function handleTopup() {}
function handleFreeze() {}
function handleCancel() {}
function handleWithdraw() {}
function handleUnfreeze() {}
</script>

<template>
  <USlideover v-model="isOpenCardDetailSlideover" :prevent-close="true" @close-prevented="onClosePrevented()">
    <div class="flex flex-col items-center bg-[#1C1D23]">
      <div class="w-full flex flex-row items-center py-6 px-8 gap-4">
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
          <img class="mt-auto mb-3 w-[110px]" src="~/assets/img/cards/add-to-apple.png" alt="" />
          <div class="flex flex-row justify-between karla tracking-[3px] text-24-400 text-[#D7D9E5] w-full">
            <div v-for="(part, index) in cardNumberArray" :key="index">{{ part }}</div>
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
            <transition name="fade-overlay">
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
              <div>{{ t(`cards.slideovers.detail.info.cardNumber`) }}</div>
              <div v-if="isShowCardSensitiveDetail" class="flex flex-row gap-2 items-center">
                <span>{{ cardSensitiveDetail?.card_number }}</span>
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
                <span>{{ cardSensitiveDetail?.CVV || 'CVV' }}</span>
                <img
                  class="cursor-pointer"
                  @click="handleCopy(1, cardSensitiveDetail?.CVV || 'CVV')"
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
            <div class="w-[128px] h-[128px]">
              <div class="chart flex items-center justify-center z-100" :style="chartClass">
                <div class="balance-rate">{{ balanceRate }}%</div>
              </div>
            </div>
            <div class="flex flex-col gap-4 text-[#7A7D89] text-12-500-20 grow">
              <div class="flex flex-row">
                <span class="text-[#ff5c5c] w-2">*</span>
                <div class="ml-3">{{ t(`cards.slideovers.detail.info.purpose`) }}</div>
                <div class="ml-auto">{{ cardDetail?.card_purpose }}</div>
              </div>
              <div class="flex flex-row items-center">
                <div class="bg-[#D7D9E5] w-2 h-2 rounded-full"></div>
                <div class="ml-3">{{ t(`cards.slideovers.detail.info.total_top_up`) }}</div>
                <div class="ml-auto text-[#1C1D23] text-14-500-20">
                  ${{ formatMoneyWithoutDecimals(cardDetail?.total_top_up) }}
                </div>
              </div>
              <div class="flex flex-row items-center">
                <div class="bg-[#FF5524] w-2 h-2 rounded-full"></div>
                <div class="ml-3">{{ t(`cards.slideovers.detail.info.total_withdraw`) }}</div>
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
