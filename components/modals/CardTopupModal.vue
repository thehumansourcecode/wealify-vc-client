<script setup lang="ts">
import { formatMoney, formatMoneyWithoutDecimals } from '~/common/functions'
import { CommonCurrency, FeeAmountType, FeeType } from '~/types/common'
import { MAX_SPEND_LIMIT } from '../cards/constants'
import { number, object, string } from 'yup'
import { commonService } from '~/services/common.service'
const { t } = useI18n()

const { copy, copied } = useClipboard()
const toast = useToast()

const cardStore = useCardStore()
const commonStore = useCommonStore()
const userStore = useUserStore()

const dropdownCardList = ref([])

onMounted(async () => {
  const [cardListResponse, feeResponse, balanceResponse] = await Promise.all([
    commonService.getDropdownCardList({}),
    commonStore.getFee(),
    userStore.getBalance()
  ])
  if (cardListResponse.success) {
    dropdownCardList.value = cardListResponse.data.items
  }
})

const selectedCard = ref(cardStore.selectedCardForTopup)
const walletBalance = computed(() => userStore.userBalance?.wallet_balance?.balance)
const topupCardFees = computed(() => {
  if (!commonStore.feeList?.TOP_UP_CARD) return { type: undefined, value: 0 }
  return commonStore.feeList.TOP_UP_CARD
})
const loading = computed(() => cardStore.isLoading.topupCard)
const { 
  isPreventClose
} = storeToRefs(cardStore)

const currencyInputRef = ref()

const form = reactive({
  amount: 0,
})

const isFormValid = ref(false)

const presetAmounts = computed(() => {
  const balance = form.amount
  if (!balance || balance == 0) {
    return [500, 1000, 2000, 5000]
  }
  if (+balance >= 100000000) {
    return []
  }
  if (+balance >= 10000000) {
    return [balance, balance * 10]
  }
  if (+balance >= 1000000) {
    return [balance, balance * 10, balance * 100]
  } else {
    return [balance, balance * 10, balance * 100, balance * 1000]
  }
})

const setAmount = amount => {
  form.amount = amount > MAX_SPEND_LIMIT ? MAX_SPEND_LIMIT : amount
  if (currencyInputRef?.value) {
    setTimeout(() => {
      currencyInputRef.value.focusInput()
      currencyInputRef.value.blurInput()
    })
  }
}

watch(
  () => form.amount,
  async () => {
    try {
      // Validate the entire form, don't stop at the first error
      await topupCardSchema.validate(form, { abortEarly: false })
      isFormValid.value = true // No errors, enable the button
    } catch (error) {
      isFormValid.value = false // Errors found, disable the button
    }
  },
  { deep: true }, // Watch nested object changes
)

const threshold = computed(() => {
  const balance = walletBalance.value || 0
  const feeAmountType = topupCardFees.value?.type
  const feeValue = topupCardFees.value?.value
  if (!feeValue) {
    return balance
  } else {
    if (feeAmountType === FeeAmountType.FIXED) {
      return balance - feeValue
    } else {
      return balance * (1 - feeValue)
    }
  }
})

const finalAmount = computed(() => {
  const feeAmountType = topupCardFees.value?.type
  const feeValue = topupCardFees.value?.value
  if (!feeValue) {
    return form.amount
  } else {
    if (feeAmountType === FeeAmountType.FIXED) {
      return form.amount + feeValue
    } else {
      return form.amount * (1 + feeValue)
    }
  }
})

const topupCardSchema = object({
  amount: number()
    .test('min-threshold', t('common.validator.invalid.topupCard.zeroTopup'), value => {
      return value >= 1
    })
    .test('max-threshold', t('common.validator.invalid.topupCard.insufficientBalance'), value => {
      return value <= +threshold.value
    }),
})

async function handleTopup() {
  if (selectedCard.value?.id) {
    const payload = { amount: form.amount, id: selectedCard.value.id }
    await cardStore.topupCard(payload)
  }
}
const handleClose = () =>{
  cardStore.toggleCardTopupModal(false)
  isPreventClose.value = false
}
</script>

<template>
  <BaseModal :label="t('cards.modals.topup.title')" @close-prevented="handleClose">
    <div class="flex flex-col">
      <!-- Balance -->
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="text-14-500-20 text-[#7A7D89] w-full sm:w-[120px] flex-none">
          {{ t('cards.modals.topup.label.balance') }}
        </div>
        <div class="w-full text-[#FF5524] text-16-700-24 sm:text-20-700-32">{{ formatMoney(walletBalance, CommonCurrency.USD) }}</div>
      </div>
      <USelectMenu
        class="mt-4 w-full"
        v-model="selectedCard"
        :options="dropdownCardList"
        searchable
        :searchable-placeholder="t('cards.filter.placeholder.search')"
        :selected-icon="'i-selected'"
        :search-attributes="['card_name', 'last_four']"
        :ui-menu="{
          select: 'cursor-pointer',
          base: 'relative focus:outline-none overflow-y-auto max-h-[360px] scroll-py-1',
          padding: 'p-0',
          rounded: 'rounded-l-[16px]',
          width: 'w-[max-content] min-w-full',
          option: {
            base: 'cursor-pointer text-14-500-20',
            selected: 'bg-[#F0F2F5]',
            active: 'bg-[#F0F2F5]',
            inactive: 'cursor-pointer',
            padding: 'px-3 py-[10px]',
            rounded: 'rounded-none',
            selectedIcon: {
              base: 'h-[18px] w-[18px]',
            },
            empty: 'text-sm',
          },
          empty: 'text-sm',
          input: 'px-3 py-[10px] w-full text-[#7A7D89] icon-search font-medium text-sm leading-5 m-0 bg-white',
        }"
      >
        <template #option="{ option }">
          <div class="flex flex-row gap-3">
            <img src="/icons/dashboard/mastercard.svg" alt="" />
            <div class="flex flex-col gap-1">
              <BaseTruncatedTooltip class="text-14-600-20 text-[#1C1D23] max-w-[500px]" :text="option?.card_name" />
              <span class="text-12-500-20 text-[#7A7D89]">
                {{ t(`cards.list.card_number`, { value: option?.last_four }) }}</span
              >
            </div>
          </div>
        </template>
        <template #default="{ open: open }">
          <div
            class="px-3 py-[10px] rounded-[13px] bg-[#F0F2F5] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-[64px] w-full"
          >
            <div class="text-14-500-20 text-[#7A7D89] w-full sm:w-[92px] flex-none">
              {{ t('cards.modals.topup.label.select') }}
            </div>
            <div class="flex flex-row gap-3 items-center w-full sm:w-auto">
              <div class="flex flex-row gap-3">
                <img src="/icons/dashboard/mastercard.svg" alt="" />
                <div class="flex flex-col gap-1">
                  <BaseTruncatedTooltip
                    class="text-14-600-20 text-[#1C1D23] max-w-[180px]"
                    :text="selectedCard?.card_name"
                  />
                  <span class="text-12-500-20 text-[#7A7D89]">
                    {{ t(`cards.list.card_number`, { value: selectedCard?.last_four }) }}</span
                  >
                </div>
              </div>
              <img
                src="/assets/img/icons/dropdown.svg"
                class="transition-transform"
                :class="[open && 'transform rotate-180']"
              />
            </div>
          </div>
        </template>
      </USelectMenu>
      <UForm :schema="topupCardSchema" :state="form">
        <UFormGroup
          name="amount"
          v-slot="{ error }"
          :ui="{
            error: 'absolute mt-2 text-red-500 dark:text-red-400',
          }"
        >
          <div
            class="px-4 sm:px-6 py-4 sm:py-[22px] border rounded-[16px] flex flex-col mt-5"
            :class="error ? 'border-[#ED2C38]' : 'border-[#5268E1]'"
          >
            <div class="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
              <div class="flex flex-row gap-1">
                <div class="text-[#1C1D23] text-14-500-20">
                  {{ t('cards.modals.topup.label.amount') }}
                </div>
                <UTooltip
                  text="The maximum amount is 999,999,999"
                  :popper="{ arrow: true, placement: 'top' }"
                  :ui="{
                    background: 'bg-[#1C1D23]',
                    color: 'text-[#FFF]',
                    base: 'px-3 py-2 h-8 text-xs font-medium',
                    ring: 'ring-0',
                    arrow: { background: 'before:bg-[#1C1D23]' },
                  }"
                >
                  <img src="~/assets/img/icons/tooltip.svg" alt="" />
                </UTooltip>
              </div>
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('cards.issue.balance.form.availableCard', { amount: formatMoney(selectedCard?.balance || 0) }) }}
              </div>
            </div>
            <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-4 w-full">
              <BaseFormattedCurrencyInput v-model="form.amount" ref="currencyInputRef" class="w-full sm:w-auto" />
              <div class="flex flex-row gap-[6px] py-1 pr-3 pl-[6px] bg-[#F0F2F5] rounded-[44px] w-fit">
                <img src="~/assets/img/flags/us.svg" alt="" />
                <div class="text-[#1C1D23] text-12-500-20">USD</div>
              </div>
            </div>
            <div class="flex flex-wrap gap-[5px] mt-[14px] justify-start">
              <UButton
                v-for="(amount, index) in presetAmounts"
                :key="index"
                @click="setAmount(amount)"
                class="flex items-center py-[4px] px-3 bg-[#EDEFFF] hover:bg-[#DCDEEE] rounded-[44px] w-fit"
              >
                <div class="text-[#1C1D23] text-12-500-20">{{ formatMoneyWithoutDecimals(amount) }}</div>
              </UButton>
            </div>
          </div>
        </UFormGroup>
      </UForm>
      <div class="mb-6 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div class="text-12-500-20 text-[#7A7D89]">{{ t('cards.modals.topup.label.fee') }}</div>
        <div v-if="topupCardFees?.type === FeeAmountType.PERCENT" class="text-14-500-20">
          {{ topupCardFees?.value * 100 || 0 }}%
        </div>
        <div v-else-if="topupCardFees?.type === FeeAmountType.FIXED" class="text-14-500-20">
          {{ formatMoney(topupCardFees?.value || 0, CommonCurrency.USD) }}
        </div>
      </div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div class="text-12-500-20">{{ t('cards.modals.topup.label.topup') }}</div>
        <div class="text-16-700-24">{{ formatMoney(finalAmount, CommonCurrency.USD) }}</div>
      </div>
      <div class="mt-4">
        <BaseSubmitButton
          @click="handleTopup"
          :loading="loading"
          :is-submit-enabled="isFormValid"
          :title="t('cards.button.topupCard')"
          class="w-full sm:w-auto"
        />
      </div>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped></style>
