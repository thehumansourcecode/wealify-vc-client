<script lang="ts" setup>
import { formatMoney, shortenAddress, formatYYYYMMDDhmmA } from '~/common/functions'

import { formatAmount } from '~/utils/amount.util'
import { CommonCurrency } from '~/types/common'
import { TransactionDetailType } from '~/types/transactions'
const { copy, copied } = useClipboard()
const toast = useToast()

const copyIndex = ref(0)

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

const dashboardStore = useDashboardStore()

const dayjs = useDayjs()

const { t } = useI18n()
const transactionStore = useTransactionStore()

const transactionDetail = computed(() => transactionStore.selectedTransactionDetail)
</script>

<template>
  <TransactionDetailSlideover /> 
  <CardDetailSlideover />
</template>
