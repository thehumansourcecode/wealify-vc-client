<script setup lang="ts">
import { formatMoney, shortenAddress } from '~/common/functions'
import { formatYYYYMMDDhmmA } from '~/common/functions'
import { TransactionVCType } from '~/types/transactions'
import { formatAmount } from '~/utils/amount.util'

const { copy, copied } = useClipboard()
const { t } = useI18n()
const toast = useToast()

const dashboardStore = useDashboardStore()

const dayjs = useDayjs()

const copyIndex = ref(0)

const transactionStore = useTransactionStore()
const isOpenTransactionDetailSlideover = computed(() => transactionStore.isOpenTransactionDetailSlideover)
const transactionDetail = computed(() => transactionStore.selectedTransactionDetail)

function copyTransactionId() {
  if (!transactionDetail.value) return
  copy(transactionDetail.value.transaction_id)
  copyIndex.value = 0

  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

function copyTransactionAddress() {
  // copy(transactionDetail.value.address)
  copyIndex.value = 1

  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

function onClosePrevented() {
  transactionStore.toggleTransactionDetailSlideover(false)
}

function handleNewTransaction() {
  transactionStore.toggleTransactionDetailSlideover(false)
  navigateTo('/')
  dashboardStore.toggleWalletTopupModal(true)
}
</script>

<template>
  <USlideover
    v-if="transactionDetail"
    v-model="isOpenTransactionDetailSlideover"
    :ui="{
      overlay: {
        background: 'bg-[#1b1c23]/30',
      },
    }"
    :prevent-close="true"
    :transition="true"
    @close-prevented="onClosePrevented()"
  >
    <div class="flex flex-col items-center">
      <div class="w-full flex flex-row justify-between items-center py-6 px-8">
        <div class="text-20-600-32 text-[#1C1D23]">
          {{ t(`transactions.detail.label.${transactionDetail.transaction_vc_type}`) }}
        </div>
        <img
          class="cursor-pointer hover:opacity-70"
          src="~/assets/img/common/close.svg"
          alt=""
          @click="onClosePrevented()"
        />
      </div>

      <div class="flex flex-col items-center slideover-content overflow-y-auto px-8">
        <img class="w-[180px]" src="/images/transactions/slideover-banner.svg" alt="" />
        <div class="pt-5 flex flex-row justify-between items-end w-full">
          <div class="flex-col gap-[6px]">
            <div class="uppercase text-[#1C1D23] text-14-500-20">
              {{ t(`transactions.detail.label.${transactionDetail.transaction_vc_type}`) }}
            </div>
            <div class="text-32-700-44 text-[#FF5524]">{{ formatMoney(transactionDetail.received_amount, 'USD') }}</div>
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t(`transactions.detail.to`, { destination: transactionDetail?.to || 'Wealify Balance' }) }}
            </div>
          </div>
          <div
            class="flex flex-row gap-[6px] items-center px-[14px] py-[6px] rounded-[8px]"
            :style="{
              color: getStatusColor(transactionDetail?.transaction_vc_status),
              background: '#EBF6EE',
            }"
          >
            <div class="text-12-600-20">
              {{ t(`transactions.detail.status.${transactionDetail.transaction_vc_status}`) }}
            </div>
            <div
              class="w-[6px] h-[6px] rounded-[1px]"
              :style="{ background: getStatusColor(transactionDetail?.transaction_vc_status) }"
            ></div>
          </div>
        </div>

        <div class="px-5 py-3 mt-5 bg-[#F0F2F5] rounded-[18px] flex flex-col gap-5 w-full">
          <div class="flex flex-row justify-between items-center">
            <div class="text-12-500-20 text-[#1C1D23]">
              {{ t(`transactions.detail.amountLabel.${transactionDetail.transaction_vc_type}`) }}
            </div>
            <div class="text-16-700-24 text-[#1C1D23]">
              {{ t(`transactions.detail.amount`, { amount: formatAmount(transactionDetail.amount) }) }}
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('transactions.detail.rate') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{
                t(`transactions.detail.rateValue`, {
                  rateUSDT: formatAmount(transactionDetail.rate.value),
                  rateUSD: formatAmount(transactionDetail.rate.value),
                })
              }}
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('transactions.detail.fee') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{
                t(`transactions.detail.feeValue`, {
                  fee: formatAmount(transactionDetail?.amount - transactionDetail?.received_amount || 0),
                })
              }}
            </div>
          </div>
        </div>

        <div class="p-2 mt-2 flex flex-col w-full">
          <div class="flex flex-row justify-between items-center pb-4">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('transactions.detail.id') }}
            </div>
            <div class="flex flex-row gap-2 items-center">
              <div class="text-14-500-20 text-[#1C1D23]">
                {{ transactionDetail.transaction_id }}
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
              {{ t('transactions.detail.created_at') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ formatYYYYMMDDhmmA(dayjs.utc(transactionDetail.created_at).local()) }}
            </div>
          </div>
          <div class="flex flex-row justify-between items-center mb-1">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('transactions.detail.successAt') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ formatYYYYMMDDhmmA(dayjs.utc(transactionDetail.updated_at).local()) }}
            </div>
          </div>
        </div>

        <div class="px-5 py-3 mt-2 bg-[#F0F2F5] rounded-[18px] flex flex-col gap-5 w-full">
          <div class="flex flex-row justify-between items-center">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('transactions.detail.address') }}
            </div>
            <div class="flex flex-row gap-2 items-center">
              <div class="text-14-500-20 text-[#1C1D23]">
                <!-- {{ shortenAddress(transactionDetail.address) }} -->
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
              {{ t('transactions.detail.txhash') }}
            </div>
            <!-- <ULink :to="transactionDetail.txhash" target="_blank" class="text-14-500-20 text-[#1C1D23]">
              {{ transactionDetail.txhash }}
            </ULink> -->
          </div>
        </div>

        <div class="text-12-500-20 mt-5">
          <span class="text-[#7A7D89]">
            {{ t('transactions.detail.contact') }}
          </span>
          <ULink class="text-[#FF5524]"> support@wealify.com </ULink>
        </div>

        <UButton
          @click="handleNewTransaction()"
          v-if="transactionDetail.transaction_vc_type === TransactionVCType.TOP_UP"
          class="flex items-center bg-[#1C1D23] hover:bg-[#3D3E34] justify-center w-[400px] my-8 rounded-[49px]"
        >
          <div class="text-white text-14-600-20 px-4 py-[14px]">
            {{ t(`transactions.detail.createNew.${transactionDetail.transaction_vc_type}`) }}
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

.styled-button:disabled {
  background-color: #a4a8b8 !important;
}
</style>
