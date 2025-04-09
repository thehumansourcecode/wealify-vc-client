<script setup lang="ts">
import { formatMoney, shortenAddress } from '~/common/functions'
import { formatYYYYMMDDhmmA } from '~/common/functions'
import { CommonCurrency } from '~/types/common'
import { TransactionDetailType, TransactionVCType } from '~/types/transactions'
import { formatAmount } from '~/utils/amount.util'

const { copy, copied } = useClipboard()
const { t } = useI18n()
const toast = useToast()

const dashboardStore = useDashboardStore()

const dayjs = useDayjs()

const copyIndex = ref(0)

const isShowFullCardNumber = ref(false)

const transactionStore = useTransactionStore()
const isOpenTransactionDetailSlideover = computed(() => transactionStore.isOpenTransactionDetailSlideover)
const transactionDetail = computed(() => transactionStore.selectedTransactionDetail)

const cardNumberArray = computed(() => transactionDetail.value?.virtual_card?.card_number?.match(/.{1,4}/g))

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
  dashboardStore.toggleWalletTopupModal(true)
}

const transactionDestination = computed(() => {})
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
          {{ t(`transactions.detail.label.${transactionDetail?.detailType}`) }}
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
              {{ t(`transactions.detail.label.${transactionDetail?.detailType}`) }}
            </div>
            <div class="text-32-700-44 text-[#FF5524]">
              {{ formatMoney(transactionDetail.received_amount, CommonCurrency.USD) }}
            </div>
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
              {{ t(`transactions.detail.amountLabel.${transactionDetail?.detailType}`) }}
            </div>
            <div class="text-16-700-24 text-[#1C1D23]">
              {{
                t(`transactions.detail.amount.${transactionDetail?.detailType}`, {
                  currency: transactionDetail.currency.symbol ,
                  amount: formatMoney(transactionDetail?.amount),
                })
              }}
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('transactions.detail.rate') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              <span
                v-if="
                  transactionDetail?.detailType === TransactionDetailType.CARD_PAYMENT ||
                  transactionDetail?.detailType === TransactionDetailType.WALLET_TOP_UP
                "
              >
                {{
                  t(`transactions.detail.rateValue`, {
                    currency: transactionDetail.currency.symbol ,
                    rateUSDT: formatAmount(transactionDetail?.rate.value),
                    rateUSD: 1,
                  })
                }}
              </span>
              <span v-else> - </span>
            </div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('transactions.detail.fee') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{
                formatMoney(
                  Math.abs(transactionDetail.amount - transactionDetail.received_amount) || 0,
                  CommonCurrency.USD,
                )
              }}
            </div>
          </div>
        </div>

        <div class="p-2 mt-2 flex flex-col w-full">
          <div class="flex flex-row justify-between items-center pb-4">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t(`transactions.detail.id.${transactionDetail?.transaction_vc_type}`) }}
            </div>
            <div class="flex flex-row gap-2 items-center">
              <div class="text-14-500-20 text-[#1C1D23]">
                {{ transactionDetail?.transaction_id }}
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
              {{ formatYYYYMMDDhmmA(dayjs.utc(transactionDetail?.created_at).local()) }}
            </div>
          </div>
          <div class="flex flex-row justify-between items-center mb-1">
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ t('transactions.detail.successAt') }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ formatYYYYMMDDhmmA(dayjs.utc(transactionDetail?.updated_at).local()) }}
            </div>
          </div>
        </div>
        <div class="px-5 py-4 mt-2 bg-[#F0F2F5] rounded-[18px] w-full">
          <div
            v-if="transactionDetail.detailType === TransactionDetailType.WALLET_TOP_UP"
            class="flex flex-col gap-5 w-full"
          >
            <div class="flex flex-row justify-between items-center">
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('transactions.detail.address') }}
              </div>
              <div class="flex flex-row gap-2 items-center">
                <div class="text-14-500-20 text-[#1C1D23]">
                  <!-- {{ shortenAddress(transactionDetail.address) }} -->
                </div>
                <!-- <img
                  class="cursor-pointer"
                  @click="copyTransactionAddress()"
                  :src="copied && copyIndex ? `/icons/common/copied-bordered.svg` : `/icons/common/copy-bordered.svg`"
                  alt=""
                /> -->
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('transactions.detail.txhash') }}
              </div>
              <ULink :to="transactionDetail?.txhash" target="_blank" class="text-14-500-20 text-[#1C1D23]">
                {{ transactionDetail?.txhash }}
              </ULink>
            </div>
          </div>
          <div v-else class="flex flex-col gap-5 w-full">
            <div class="flex flex-row justify-between items-center">
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('transactions.detail.cardName') }}
              </div>
              <div class="text-14-500-20 text-[#1C1D23]">
                {{ transactionDetail?.virtual_card?.card_name }}
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('transactions.detail.cardNumber') }}
              </div>
              <div class="flex flex-row gap-2 items-center">
                <div class="text-14-500-20 text-[#1C1D23]">
                  <span v-if="!isShowFullCardNumber">
                    {{ t(`cards.list.card_number`, { value: transactionDetail?.virtual_card?.last_four }) }}
                  </span>
                  <span v-else>{{ cardNumberArray }}</span>
                </div>
                <div class="p-[5px] bg-white rounded-[50px] cursor-pointer border border-[#D7D9E5]">
                  <img
                    class="w-[18px]"
                    @click="isShowFullCardNumber = !isShowFullCardNumber"
                    :src="
                      !isShowFullCardNumber ? `/images/transactions/eye.svg` : `/images/transactions/eye-disabled.svg`
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-12-500-20 mt-5">
          <span class="text-[#7A7D89]">
            {{ t('transactions.detail.contact') }}
          </span>
          <ULink to="mailto:support@cs2agent.com" class="text-[#FF5524]"> support@wealify.com </ULink>
        </div>

        <div  v-if=" transactionDetail?.detailType === TransactionDetailType.CARD_PAYMENT" class="flex items-center mt-8 gap-[10px] mb-12">
          <UButton
          class="flex items-center bg-[#F0F2F5] hover:bg-[#F0F2F5] h-[48px] justify-center w-[195px] rounded-[49px]"
        >
        <img
          class="cursor-pointer hover:opacity-70"
          src="~/assets/img/flags/flag.svg"
          alt=""
          @click="onClosePrevented()"
        />
          <div class="text-[#1C1D23] text-14-600-20 manrope">
            {{ t(`transactions.detail.disputeTransaction.${transactionDetail?.detailType}`) }}
          </div>
        </UButton>

          <UButton
          class="flex items-center bg-[#1C1D23] hover:bg-[#3D3E34]  h-[48px] justify-center w-[195px] rounded-[49px]"
        >
          <div class="text-white text-14-600-20 manrope">
            {{ t(`transactions.detail.downloadInvoice.${transactionDetail?.detailType}`) }}
          </div>
        </UButton>
        </div>
        

        <UButton
          @click="handleNewTransaction()"
          v-if=" transactionDetail?.detailType === TransactionDetailType.WALLET_TOP_UP"
          class="flex items-center bg-[#1C1D23] hover:bg-[#3D3E34] justify-center w-[400px] my-8 rounded-[49px]"
        >
          <div class="text-white text-14-600-20 px-4 py-[14px]">
            {{ t(`transactions.detail.createNew.${transactionDetail.detailType}`) }}
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
