<script setup lang="ts">
import { TransactionStatus, TransactionType } from '~/types/dashboard'
import { formatMoney, shortenAddress } from '~/common/functions'
import { formatYYYYMMDDhmmA } from '~/common/functions'

const { copy, copied } = useClipboard()
const { t } = useI18n()
const toast = useToast()

const dayjs = useDayjs()

const dashboardStore = useDashboardStore()
const isOpenTransactionDetailSlideover = computed(() => dashboardStore.isOpenTransactionDetailSlideover)

function onClosePrevented() {
  dashboardStore.toggleTransactionDetailSlideover(false)
}

const copyIndex = ref(0)

function copyTransactionId() {
  copy(transactionDetail.value.id)
  copyIndex.value = 0
  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

function copyTransactionAddress() {
  copy(transactionDetail.value.address)
  copyIndex.value = 1
  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

function getStatusColor(status: TransactionStatus) {
  if (status === TransactionStatus.FAILED) {
    return '#ED2C38'
  }
  if (status === TransactionStatus.SUCCESS) {
    return '#2EA518'
  }
  if (status === TransactionStatus.PROCESSING) {
    return '#02076F'
  }
}

function getBackgroundStatusColor(status: TransactionStatus) {
  if (status === TransactionStatus.FAILED) {
    return '#EBF6EE'
  }
  if (status === TransactionStatus.SUCCESS) {
    return '#EBF6EE'
  }
  if (status === TransactionStatus.PROCESSING) {
    return '#EBF6EE'
  }
}

const transactionDetail = computed(() => {
  return {
    type: TransactionType.TOPUP,
    amount: 1000,
    status: TransactionStatus.SUCCESS,
    rate: {
      usd: 1,
      usdt: 1,
    },
    to: 'Wallet',
    fee: 0,
    id: 'P12345678958254',
    created_at: '2025-03-11T13:36:41.718Z',
    updatedAt: '2025-03-11T13:36:41.718Z',
    account: 'Wealify Balance',
    address: '0x1437bEbAa45MfA88Dc9C6CFeB6e0bAAeDCD6eCdb',
    txhash: 'http://bscscan.com',
  }
})

function createNewTopup() {
  dashboardStore.toggleTransactionDetailSlideover(false)
  dashboardStore.toggleTopupModal(true)
}
</script>

<template>
  <USlideover v-model="isOpenTransactionDetailSlideover" :prevent-close="true" @close-prevented="onClosePrevented()">
    <div class="flex flex-col items-center">
      <div class="w-full flex flex-row justify-between items-center py-6 px-8">
        <div class="text-20-600-32 text-[#1C1D23]">
          {{ t(`dashboard.slideovers.transaction.label.${transactionDetail.type}`) }}
        </div>
        <img
          class="cursor-pointer hover:opacity-70"
          src="~/assets/img/common/close.svg"
          alt=""
          @click="onClosePrevented()"
        />
      </div>

      <div class="flex flex-col items-center slideover-content overflow-y-auto px-8">
        <img class="w-[180px]" src="~/assets/img/dashboard/slideover-topup.svg" alt="" />
        <div class="pt-5 flex flex-row justify-between items-end w-full">
          <div class="flex-col gap-[6px]">
            <div class="uppercase text-[#1C1D23] text-14-500-20">
              {{ t(`dashboard.slideovers.transaction.label.${transactionDetail.type}`) }}
            </div>
            <div class="text-32-700-44 text-[#FF5524]">{{ formatMoney(transactionDetail.amount, 'USD') }}</div>
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t(`dashboard.slideovers.transaction.to`, { destination: transactionDetail.to }) }}
            </div>
          </div>
          <div
            class="flex flex-row gap-[6px] items-center px-[14px] py-[6px] rounded-[8px]"
            :style="{
              color: getStatusColor(transactionDetail?.status),
              background: getBackgroundStatusColor(transactionDetail?.status),
            }"
          >
            <div class="text-12-600-20">
              {{ t(`dashboard.transactions.table.status.${transactionDetail.status}`) }}
            </div>
            <div
              class="w-[6px] h-[6px] rounded-[1px]"
              :style="{ background: getStatusColor(transactionDetail?.status) }"
            ></div>
          </div>
        </div>

        <div class="px-5 py-3 mt-5 bg-[#F0F2F5] rounded-[18px] flex flex-col gap-5 w-full">
          <div class="flex flex-row justify-between items-center">
            <div class="text-12-500-20 text-[#1C1D23]">
              {{ t('dashboard.slideovers.transaction.topupAmount') }}
            </div>
            <div class="text-16-700-24 text-[#1C1D23]">
              {{ t(`dashboard.slideovers.transaction.amount`, { amount: transactionDetail.amount }) }}
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('dashboard.slideovers.transaction.rate') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{
                t(`dashboard.slideovers.transaction.rateValue`, {
                  rateUSDT: transactionDetail.rate.usdt,
                  rateUSD: transactionDetail.rate.usd,
                })
              }}
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('dashboard.slideovers.transaction.fee') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ t(`dashboard.slideovers.transaction.feeValue`, { fee: transactionDetail.fee }) }}
            </div>
          </div>
        </div>

        <div class="p-2 mt-2 flex flex-col w-full">
          <div class="flex flex-row justify-between items-center pb-4">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('dashboard.slideovers.transaction.id') }}
            </div>
            <div class="flex flex-row gap-2 items-center">
              <div class="text-14-500-20 text-[#1C1D23]">
                {{ transactionDetail.id }}
              </div>
              <img
                class="cursor-pointer"
                @click="copyTransactionId()"
                :src="copied && !copyIndex ? `/icons/common/copied-bordered.svg` : `/icons/common/copy-bordered.svg`"
                alt=""
              />
            </div>
          </div>
          <div class="flex flex-row justify-between items-center pb-5">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('dashboard.slideovers.transaction.created_at') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ formatYYYYMMDDhmmA(dayjs.utc(transactionDetail.created_at).local()) }}
            </div>
          </div>
          <div class="flex flex-row justify-between items-center mb-1">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('dashboard.slideovers.transaction.successAt') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ formatYYYYMMDDhmmA(dayjs.utc(transactionDetail.updatedAt).local()) }}
            </div>
          </div>
        </div>

        <div class="px-5 py-3 mt-2 bg-[#F0F2F5] rounded-[18px] flex flex-col gap-5 w-full">
          <div class="flex flex-row justify-between">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('dashboard.slideovers.transaction.account') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ transactionDetail.account }}
            </div>
          </div>
          <div class="flex flex-row justify-between items-center">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('dashboard.slideovers.transaction.address') }}
            </div>
            <div class="flex flex-row gap-2 items-center">
              <div class="text-14-500-20 text-[#1C1D23]">
                {{ shortenAddress(transactionDetail.address) }}
              </div>
              <img
                class="cursor-pointer"
                @click="copyTransactionAddress()"
                :src="copied && copyIndex ? `/icons/common/copied-bordered.svg` : `/icons/common/copy-bordered.svg`"
                alt=""
              />
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('dashboard.slideovers.transaction.txhash') }}
            </div>
            <ULink :to="transactionDetail.txhash" target="_blank" class="text-14-500-20 text-[#1C1D23]">
              {{ transactionDetail.txhash }}
            </ULink>
          </div>
        </div>

        <div class="text-12-500-20 mt-5">
          <span class="text-[#7A7D89]">
            {{ t('dashboard.slideovers.transaction.contact') }}
          </span>
          <ULink class="text-[#FF5524]"> support@wealify.com </ULink>
        </div>

        <UButton
          @click="createNewTopup()"
          class="flex items-center justify-center w-[400px] bg-[#1C1D23] hover:bg-[#3D3E34] my-8 rounded-[49px]"
        >
          <div class="text-white text-14-600-20 px-4 py-[14px]">
            {{ t('dashboard.slideovers.transaction.newTopup') }}
          </div>
        </UButton>
      </div>
    </div>
  </USlideover>
</template>

<style lang="scss" scoped>
.slideover-content {
  max-height: calc(100vh - 80px);
}
</style>
