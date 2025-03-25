<script setup lang="ts">
import { TransactionStatus, TransactionType } from '~/types/dashboard'
import { formatMMYYYY, formatMoney, shortenAddress, formatMoneyWithoutDecimals, roundNumber } from '~/common/functions'
import { CardStatus } from '~/types/cards'
import { CommonCurrency } from '~/types/common'
import { showToast, ToastType } from '~/common/functions'
const { copy, copied } = useClipboard()
const {
  freezeCard,
  cancelCard,
  getCardDetailById
} = useCardStore()

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
const loading = ref({
  freeze:false,
  cancel:false,
})

const cardSensitiveDetail = ref({
  CVV: '888',
  card_number: '1231 1232 1233 9998',
})

const cardNumberArray = cardSensitiveDetail.value.card_number.split(' ')

const balanceRate = computed(() =>
  cardDetail.value?.total_top_up
    ? roundNumber(((cardDetail.value?.total_withdraw || 120) / cardDetail.value?.total_top_up) * 100, 1)
    : 0,
)

const chartClass = computed(() => {
  return `background: conic-gradient(#FF5524 0% ${balanceRate.value}%, #D7D9E5 ${balanceRate.value}% 100%)`
})

const chartContainer = ref(null)
const isWithdrawTooltipVisible = ref(false)
const isBalanceTooltipVisible = ref(false)

// Handle mouse movement to detect hover over total_withdraw section
const handleMouseMove = event => {
  const rect = chartContainer.value?.getBoundingClientRect()
  const x = event.clientX - rect.left - 64 // Center at (64, 64)
  const y = event.clientY - rect.top - 64
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

function handleShowSensitiveDetail() {
  isShowCardSensitiveDetail.value = true
  isShowCardSensitiveDetailOverlay.value = false
}

function onClosePrevented() {
  cardStore.toggleCardDetailSlideover(false)
}

function handleViewTransaction() {
  cardStore.toggleCardDetailSlideover(false)
  navigateTo('/transactions')
}

// Actions
function handleTopup() {

}

const handleFreeze = async() => {
  loading.value.freeze = true
  const result = await freezeCard(cardDetail.value.id)
  loading.value.freeze = false
  if (!result.success){
    showToast(ToastType.FAILED, result.message)
    return
  }
  showToast(ToastType.SUCCESS, t('cards.message.freeze'))
  await getCardDetailById(cardDetail.value.id)
}

const handleCancel = async() => {
  loading.value.cancel = true
  const result = await cancelCard(cardDetail.value.id)
  loading.value.cancel = false
  if (!result.success){
    showToast(ToastType.FAILED, result.message)
    return
  }
  showToast(ToastType.SUCCESS, t('cards.message.freeze'))
  await getCardDetailById(cardDetail.value.id)
}

function handleWithdraw() {

}
function handleUnfreeze() {

}
</script>

<template>
  <USlideover
    v-model="isOpenCardDetailSlideover"
    :prevent-close="true"
    @close-prevented="onClosePrevented()"
    :ui="{
      width: 'w-screen max-w-[464px]',
      overlay: {
        background: 'bg-[#1c1d23]/30',
      },
    }"
  >
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
            <ButtonsCardDetail :type='`topup`'/>
            <ButtonsCardDetail :type='`freeze`'  @click='handleFreeze' :loading='loading.freeze' />
            <ButtonsCardDetail :type='`cancel`' @click='handleCancel' :loading='loading.cancel' />
            <ButtonsCardDetail :type='`withdraw`' />
            
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
              <div>{{ t(`cards.slideovers.detail.info.card_number`) }}</div>
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
            <div
              class="w-[128px] h-[128px] relative flex-none"
              ref="chartContainer"
              @mousemove="handleMouseMove"
              @mouseleave="isWithdrawTooltipVisible = false"
            >
              <div class="chart flex items-center justify-center z-100" :style="chartClass">
                <div class="balance-rate">{{ balanceRate }}%</div>
              </div>
              <div
                v-if="isWithdrawTooltipVisible && cardDetail?.total_withdraw"
                class="absolute top-[50%] -translate-y-1/2 left-[103%] bg-[#1C1D23] py-2 px-3 flex flex-row items-center gap-[6px] rounded-[8px]"
              >
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
                class="absolute -top-10 bg-[#1C1D23] py-2 px-3 flex flex-row items-center gap-[6px] rounded-[8px]"
              >
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
                <div class="ml-auto truncate text-right max-w-[100px]">{{ cardDetail?.card_purpose }}</div>
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
