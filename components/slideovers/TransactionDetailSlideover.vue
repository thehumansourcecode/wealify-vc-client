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
      <div class="flex flex-col items-center slideover-content overflow-y-auto px-8 pb-20 lg:pb-0">
        <img class="w-[180px]" :src="getBanner(transactionDetail?.transaction_vc_status)" alt="" />
        <div class="pt-5 flex flex-row justify-between items-end w-full">
          <div class="flex-col gap-[6px]">
            <div class="uppercase text-[#1C1D23] text-14-500-20">
              {{ t(`transactions.detail.label.${transactionDetail?.detailType}`) }}
              <UBadge
                v-if="
                  transactionDetail?.detailType === TransactionDetailType.CARD_PAYMENT &&
                  transactionDetail?.transaction_linked_id
                "
                color="gray"
                variant="solid"
                class="normal-case ml-2 px-3"
                >Refund</UBadge
              >
            </div>
            <div class="text-32-700-44 text-[#FF5524]">
              {{ formatMoney(Math.abs(transactionDetail?.received_amount), CommonCurrency.USD) }}
            </div>
            <div class="text-12-500-20 text-[#7A7D89]">
              {{ transactionDetail?.detailType === TransactionDetailType.CARD_REFUND ? 'from' : 'to' }}
              {{
                transactionDetail?.detailType === TransactionDetailType.CARD_PAYMENT ||
                transactionDetail?.detailType === TransactionDetailType.CARD_REFUND
                  ? transactionDetail.confirm_transaction?.raw_data?.merchant?.name
                  : t(`transactions.detail.to.${transactionDetail.detailType}`)
              }}
            </div>
            <div
              v-if="transactionDetail?.confirm_transaction?.raw_data?.failure_reason"
              class="inline-flex items-center flex-start gap-[5px] mt-2"
            >
              <UIcon name="i-mdi-alert-circle" class="w-4 h-4 bg-[#ed2c38] text-white" />
              <div class="text-[#7A7D89] text-12-500-20">
                {{
                  transactionDetail?.confirm_transaction?.raw_data?.failure_reason
                    .toLowerCase()
                    .replace(/_/g, ' ')
                    .replace(/^\w/, c => c.toUpperCase())
                }}
              </div>
            </div>
          </div>
          <div
            class="flex flex-row gap-[6px] items-center px-[14px] py-[6px] rounded-[8px] border"
            :style="{
              color: getStatusColor(transactionDetail?.transaction_vc_status)?.color,
              borderColor: getStatusColor(transactionDetail?.transaction_vc_status)?.color,
              background: getStatusColor(transactionDetail?.transaction_vc_status)?.background,
            }"
          >
            <div class="text-12-600-20">
              {{ t(`transactions.detail.status.${transactionDetail.transaction_vc_status}`) }}
            </div>
            <div
              class="w-[6px] h-[6px] rounded-[1px]"
              :style="{ background: getStatusColor(transactionDetail?.transaction_vc_status)?.color }"
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
                transactionDetail?.detailType === TransactionDetailType.CARD_PAYMENT ||
                transactionDetail?.detailType === TransactionDetailType.CARD_REFUND
                  ? t(`transactions.detail.amount.${transactionDetail?.detailType}`, {
                      currency: transactionDetail.confirm_transaction?.raw_data?.destination_currency,
                      amount: parseFloat(
                        transactionDetail.confirm_transaction?.raw_data?.fx_rate * Math.abs(transactionDetail?.amount),
                      )?.toFixed(2),
                    })
                  : t(`transactions.detail.amount.${transactionDetail?.detailType}`, {
                      currency:
                        transactionDetail?.detailType === TransactionDetailType.WALLET_TOP_UP ||
                        transactionDetail?.detailType === TransactionDetailType.CARD_CRYPTO_TOP_UP
                          ? transactionDetail.confirm_transaction?.raw_data?.token
                          : transactionDetail.currency.symbol,
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
                  transactionDetail?.detailType === TransactionDetailType.WALLET_TOP_UP ||
                  transactionDetail?.detailType === TransactionDetailType.CARD_CRYPTO_TOP_UP ||
                  transactionDetail?.detailType === TransactionDetailType.CARD_REFUND
                "
              >
                {{
                  transactionDetail?.detailType === TransactionDetailType.WALLET_TOP_UP ||
                  transactionDetail?.detailType === TransactionDetailType.CARD_CRYPTO_TOP_UP
                    ? t(`transactions.detail.rateValue`, {
                        currency: transactionDetail.confirm_transaction?.raw_data?.token,
                        rateUSDT: formatAmount(transactionDetail?.rate.value),
                        rateUSD: 1,
                      })
                    : transactionDetail?.detailType === TransactionDetailType.CARD_PAYMENT ||
                        transactionDetail?.detailType === TransactionDetailType.CARD_REFUND
                      ? t(`transactions.detail.rateValue`, {
                          currency: transactionDetail.confirm_transaction?.raw_data?.destination_currency,
                          rateUSDT: parseFloat(transactionDetail.confirm_transaction?.raw_data?.fx_rate?.toFixed(2)),
                          rateUSD: 1,
                        })
                      : t(`transactions.detail.rateValue`, {
                          currency: transactionDetail.currency.symbol,
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
              <span v-if="transactionDetail.fee.type == FeeAmountType.PERCENT && transactionDetail.fee.value > 0"
                >({{ roundTo(transactionDetail.fee.value * 100, 3) }}%)</span
              >
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
              {{ t(`transactions.detail.id.${transactionDetail.detailType}`) }}
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

          <div
            class="flex flex-row justify-between items-center pb-4 relative"
            v-if="
              transactionDetail?.detailType !== TransactionDetailType.WALLET_TOP_UP &&
              transactionDetail?.detailType !== TransactionDetailType.CARD_CRYPTO_TOP_UP &&
              transactionDetail?.transaction_linked_id
            "
          >
            <div class="flex flex-row text-12-500-20" @click="getTransactionLinkTo">
              <div class="flex absolute flex-col items-center space-y-[3px] bottom-[25px]">
                <div v-for="n in 4" :key="n" class="w-[2px] h-[5px] bg-gray-400 rounded-full"></div>
                <div class="w-[6px] h-[6px] bg-gray-400 rounded-full"></div>
              </div>
              <span class="text-[#5268E1] underline cursor-pointer ml-3 flex items-center gap-1">
                {{ t(`transactions.detail.id2.${transactionDetail.detailType}`) }}
                <Icon name="mdi:arrow-top-right" class="w-4 h-4 text-[#5268E1]" />
              </span>
            </div>
            <div class="flex flex-row gap-2 items-center">
              <div class="text-14-500-20 text-[#1C1D23]">
                {{ transactionDetail?.transaction_linked?.transaction_id }}
              </div>
              <img
                class="cursor-pointer"
                @click="copyTransactionLinkId()"
                :src="
                  copied && copyIndex == 2 ? `/icons/common/copied-bordered.svg` : `/icons/common/copy-bordered.svg`
                "
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
              {{ getStatusText(transactionDetail?.transaction_vc_status) }}
            </div>
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ formatYYYYMMDDhmmA(dayjs.utc(transactionDetail?.updated_at).local()) }}
            </div>
          </div>
        </div>

        <div class="px-5 py-4 mt-2 bg-[#F0F2F5] rounded-[18px] w-full">
          <div
            v-if="transactionDetail?.detailType === TransactionDetailType.CARD_CRYPTO_TOP_UP"
            class="flex flex-col gap-5 w-full"
          >
            <div class="flex flex-row justify-between items-center">
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('transactions.detail.cardName') }}
              </div>
              <div class="text-14-500-20 text-[#1C1D23]">
                {{ transactionDetail?.virtual_card?.card_name }}
              </div>
            </div>
            <div class="flex flex-row justify-between items-center mb-5">
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

          <div v-if="transactionDetail?.crypto_wallet" class="flex flex-col gap-5 w-full">
            <div class="flex flex-row justify-between items-center">
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('transactions.detail.wallet') }}
              </div>
              <div class="flex flex-row gap-2 items-center">
                <div class="text-14-500-20 text-[#1C1D23]">
                  {{ getWallet(transactionDetail?.crypto_wallet?.network) }}
                </div>
              </div>
            </div>

            <div class="flex flex-row justify-between items-center">
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('transactions.detail.address') }}
              </div>
              <div class="flex flex-row gap-2 items-center">
                <div class="text-14-500-20 text-[#1C1D23]">
                  {{ shortenAddress(transactionDetail?.crypto_wallet?.address) }}
                </div>
                <img
                  class="cursor-pointer"
                  @click="copyTransactionAddress()"
                  :src="copied && copyIndex ? `/icons/common/copied-bordered.svg` : `/icons/common/copy-bordered.svg`"
                  alt=""
                />
              </div>
            </div>
            <div class="flex flex-row justify-between items-center">
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('transactions.detail.txhash') }}
              </div>
              <div class="flex flex-row gap-2 items-center">
                <div
                  class="text-14-500-20 text-[#1C1D23]"
                  v-html="
                    getLinkTxhash(
                      transactionDetail?.crypto_wallet?.network,
                      transactionDetail?.confirm_transaction?.confirm_transaction_id,
                    )
                  "
                ></div>
              </div>
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
          <ULink to="mailto:support@wealify.com" class="text-[#FF5524]"> support@wealify.com </ULink>
        </div>

        <div
          v-if="transactionDetail?.detailType === TransactionDetailType.CARD_PAYMENT"
          class="flex flex-col items-center mt-8 gap-[10px] mb-12 lg:flex-row"
        >
          <UButton
            disabled
            class="flex items-center !bg-[#F0F2F5] hover:bg-[#F0F2F5] h-[48px] justify-center w-[195px] rounded-[49px]"
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
            disabled
            class="flex items-center !bg-[#1C1D23] hover:bg-[#3D3E34] h-[48px] justify-center w-[195px] rounded-[49px]"
          >
            <div class="text-white text-14-600-20 manrope">
              {{ t(`transactions.detail.downloadInvoice.${transactionDetail?.detailType}`) }}
            </div>
          </UButton>
        </div>

        <UButton
          @click="handleNewTransaction()"
          v-if="transactionDetail?.detailType === TransactionDetailType.WALLET_TOP_UP"
          class="flex items-center bg-[#1C1D23] hover:bg-[#3D3E34] justify-center my-8 rounded-[49px] w-[320px] lg:w-[400px]"
        >
          <div class="text-white text-14-600-20 px-4 py-[14px]">
            {{ t(`transactions.detail.createNew.${transactionDetail.detailType}`) }}
          </div>
        </UButton>
      </div>
    </div>
  </USlideover>
</template>
<script setup lang="ts">
import { formatMoney, shortenAddress } from '~/common/functions'
import { formatYYYYMMDDhmmA } from '~/common/functions'
import { CommonCurrency, FeeAmountType } from '~/types/common'
import { TransactionDetailType, TransactionVCType } from '~/types/transactions'
import { formatAmount } from '~/utils/amount.util'
import { TransactionNetwork } from '~/types/dashboard'

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

const cardNumberArray = computed(() => transactionDetail.value?.virtual_card?.card_number?.match(/.{1,4}/g).join(' '))

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

function copyTransactionLinkId() {
  if (!transactionDetail.value) return
  copy(transactionDetail.value.transaction_linked?.transaction_id)
  copyIndex.value = 2

  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

function copyTransactionAddress() {
  copy(transactionDetail.value.crypto_wallet.address)
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

const getLinkTxhash = (network: TransactionNetwork, tx_id: string) => {
  switch (network) {
    case TransactionNetwork.ETHEREUM:
      return `<a target='_blank' href="https://etherscan.io/tx/${tx_id}">etherscan.io</a>`
    case TransactionNetwork.SOLANA:
      return `<a target='_blank' href="https://solscan.io/tx/${tx_id}">solscan.io</a>`
    case TransactionNetwork.TRON:
      return `<a target='_blank' href="https://tronscan.org/#/searcherror/${tx_id}">tronscan.org</a>`
  }
}

const getWallet = (network: TransactionNetwork) => {
  switch (network) {
    case TransactionNetwork.ETHEREUM:
      return `Ethereum (ETH)`
    case TransactionNetwork.SOLANA:
      return `Solana (SOL)`
    case TransactionNetwork.TRON:
      return `Tron (TRX)`
  }
}

const getTransactionLinkTo = async () => {
  const id = transactionDetail.value?.transaction_linked?.id
  if (!id) {
    return
  }
  const result = await transactionStore.getTransaction(id)
  if (result.success) {
    transactionStore.setSelectedTransactionDetail(result.transaction)
    return
  }
}
</script>
<style lang="scss" scoped>
.slideover-content {
  max-height: calc(100vh - 80px);
}

.styled-button:disabled {
  background-color: #a4a8b8 !important;
}
</style>
