<script setup lang="ts">
import { formatMoney } from '~/common/functions'
import { CommonCurrency, FeeType } from '~/types/common'
import { TransactionCryptocurrency, TransactionNetwork } from '~/types/dashboard'
import type { IUserBalance } from '~/types/user'
const { copy, copied } = useClipboard()
const toast = useToast()

const cardStore = useCardStore()
const commonStore = useCommonStore()
const userStore = useUserStore()

onMounted(async () =>
  Promise.all([
    commonStore.getDropdownCardList(),
    commonStore.getFeeByType(FeeType.TOP_UP_CARD),
    userStore.getBalance(),
  ]),
)

const walletBalance = computed(() => userStore.userBalance?.wallet_balance?.balance)

const { t } = useI18n()
</script>

<template>
  <BaseModal :label="t('cards.modals.topup.title')" @close-prevented="cardStore.toggleCardTopupModal(false)">
    <div class="flex flex-col">
      <div class="flex flex-row gap-16 items-center">
        <div class="text-14-500-20 text-[#7A7D89]">
          {{ t('cards.modals.topup.balance.label') }}
        </div>
        <div class="w-full text-[#FF5524] text-20-700-32">{{ formatMoney(walletBalance, CommonCurrency.USD) }}</div>
      </div>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped></style>
