<script setup lang="ts">
import { TransactionDetailType } from '~/types/transactions'

const { copy, copied } = useClipboard()
const toast = useToast()
const { t } = useI18n()

const copyIndex = ref(0)

const transactionStore = useTransactionStore()
const detailType = computed(() => transactionStore.selectedTransactionDetail?.detailType)

const firstLabel = computed(() => {
  if (detailType.value === TransactionDetailType.WALLET_TOP_UP) {
    return t('transactions.detail.address')
  }
})
</script>

<template>
  <div class="px-5 py-3 mt-2 bg-[#F0F2F5] rounded-[18px] flex flex-col gap-5 w-full">
    <div class="flex flex-row justify-between items-center">
      <div class="text-12-500-20 text-[#7A7D89]">
        {{ firstLabel }}
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
    <div class="flex flex-row justify-between">
      <div class="text-12-500-20 text-[#7A7D89]">
        {{ t('transactions.detail.txhash') }}
      </div>
      <!-- <ULink :to="transactionDetail.txhash" target="_blank" class="text-14-500-20 text-[#1C1D23]">
              {{ transactionDetail.txhash }}
            </ULink> -->
    </div>
  </div>
</template>
