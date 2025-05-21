<script setup lang="ts">
import { formatMoney, formatMoneyWithoutDecimals } from '~/common/functions'
import { CommonCurrency, FeeAmountType, FeeType } from '~/types/common'
import { MAX_SPEND_LIMIT } from '../cards/constants'
import { number, object, string } from 'yup'
import { commonService } from '~/services/common.service'
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useCardStore } from '~/stores/cards'
import { useCommonStore } from '~/stores/common'
import { useUserStore } from '~/stores/user'
import { usePaymentStore } from '~/stores/payment'
// @ts-ignore
import VueQr from 'vue-qr/src/packages/vue-qr.vue'

const { t } = useI18n()

const { copy, copied } = useClipboard()

const cardStore = useCardStore()
const commonStore = useCommonStore()
const userStore = useUserStore()

const dropdownCardList = ref([])

const toast = useToast()

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

const isFormValid = ref(true)

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

const setAmount = (amount: number) => {
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
    .test('max-threshold', t('common.validator.invalid.topupCard.insufficientBalance'), value => {
      if (typeof value !== 'number') return false
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

const topupSource = ref(0) // 0: balance, 1: crypto
const tabOptions = [
  { label: 'Wealify Balance' },
  { label: 'Crypto Transfer' },
]


// const { walletInfo } = storeToRefs(paymentStore) as { walletInfo: Ref<any> }
const walletTopupFeeValue = computed(() => commonStore.feeList?.TOP_UP_WALLET.value || 0)
const walletTopupFeeType = computed(() => commonStore.feeList?.TOP_UP_WALLET?.type)

const topupAddress = computed(() => {
  if (!selectedCard.value.crypto_wallets || !selectedNetworkOption.value){
    return ''
  }
  return selectedCard.value.crypto_wallets.address[selectedNetworkOption.value.value]
})

const networkOptions = ref<any[]>([])
const selectedNetworkOption = ref<any>(undefined)
const currencyOptions = ref<any[]>([])
const selectedCurrencyOption = ref<any>(undefined)

function handleCopy(value: string) {
  copy(value)
  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

watch(selectedCard, () => {
  networkOptions.value = selectedCard.value.crypto_wallets?.network.map((network: any) => ({
    logo: `/icons/common/${network}.svg`,
    value: network,
    label: t(`dashboard.modals.topup.label.${network}`),
  })) || []
  selectedNetworkOption.value = networkOptions.value[0]
  currencyOptions.value = selectedCard.value.crypto_wallets?.token.map((token: any) => ({
    logo: `/icons/common/${token}.svg`,
    value: token,
    label: t(`dashboard.modals.topup.label.${token}`),
  })) || []
  selectedCurrencyOption.value = currencyOptions.value[0]
}, 
  { immediate: true }
)
</script>

<template>
  <USlideover
    :model-value="true"
    @update:model-value="handleClose"
    :ui="{
      overlay: {
        background: 'bg-[#1b1c23]/30',
      },
      container: 'flex items-center justify-end',
      width: 'w-full sm:w-[540px]',
      background: 'bg-white',
    }"
    :prevent-close="isPreventClose"
    @close-prevented="handleClose"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-4">
        <h2 class="text-xl font-semibold text-gray-900">{{ t('cards.modals.topup.title') }}</h2>
        <button
          class="text-gray-400 hover:text-gray-500"
          @click="handleClose"
        >
          <UIcon name="i-heroicons-x-mark-20-solid" class="w-6 h-6" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Chọn nguồn nạp bằng UTab -->
        <div class="mb-1 text-14-500-20 text-[#1C1D23]">From</div>
        <UTabs
          v-model="topupSource"
          :items="tabOptions"
          class="mb-7"
          :ui="{
            list: { base: 'flex items-center justify-between p-[2px] gap-0', rounded: 'rounded-[110px]', 
            marker: {
              wrapper: 'absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none hidden',
              base: 'w-full h-full',
              background: 'bg-white dark:bg-gray-900',
              rounded: 'rounded-md',
              shadow: 'shadow-sm'
            },
            tab: {
              base: 'flex-1 py-2 h-[36px] !rounded-[110px] text-sm font-semibold',
              active: 'bg-[#1C1D23] text-white !rounded-[110px]',
              inactive: 'bg-[#F0F2F5] text-[#1C1D23]',
            }
          },

          }"
        />
        <div v-if="topupSource === 0">
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
              />
            </div>
          </div>
        </div>
        <div v-else>
          <!-- Crypto Transfer UI mới -->
          <div class="flex flex-col gap-4">
            <div class="w-full">
              <!-- To card -->
              <div class="mb-4">
                <USelectMenu
                  class="w-full"
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
                    rounded: 'rounded-[16px]',
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
              </div>
              <!-- Network -->
              <div class="mb-4">
                <label class="text-14-500-20 block mb-1">Network<span class="text-red-500">*</span></label>
                <USelectMenu
                  class="w-full"
                  selected-icon="i-selected"
                  trailing-icon="i-dropdown"
                  :ui="{
                    variant: {
                      none: 'bg-white border border-[#D7D9E5] rounded-[48px] py-[10px] px-4 w-full',
                    },
                    icon: {
                      leading: {
                        padding: { xs: 'pl-4 pr-2.5', sm: 'pl-4 pr-2.5' },
                      },
                    },
                  }"
                  :ui-menu="{
                    select: 'cursor-pointer',
                    background: 'bg-white',
                    base: 'relative focus:outline-none overflow-y-auto scroll-py-1',
                    padding: 'p-0',
                    rounded: 'rounded-[16px]',
                    option: {
                      base: 'cursor-pointer text-14-500-20 bg-[#F0F2F5]',
                      inactive: 'bg-white hover:bg-[#F0F2F5] cursor-pointer',
                      padding: 'px-3 py-[10px]',
                      rounded: 'rounded-none',
                      selectedIcon: {
                        base: 'h-[18px] w-[18px]',
                      },
                      empty: 'text-sm',
                    },
                    empty: 'text-sm',
                    default: {
                      selectedIcon: 'i-selected',
                    },
                  }"
                  variant="none"
                  v-model="selectedNetworkOption"
                  :options="networkOptions"
                  option-attribute="name"
                >
                  <template #leading>
                    <img v-if="selectedNetworkOption?.logo" :src="selectedNetworkOption?.logo" />
                  </template>
                  <template #label>
                    <span
                      v-if="selectedNetworkOption?.label"
                      class="truncate text-14-500-20 text-[#1C1D23] max-w-[350px] pl-2.5"
                      >{{ selectedNetworkOption?.label }}</span
                    >
                  </template>
                  <template #option="{ option: network }">
                    <img :src="network.logo" alt="logo" />
                    <span class="truncate">{{ network.label }}</span>
                  </template>
                </USelectMenu>
              </div>
              <!-- Token -->
              <div class="mb-4">
                <label class="text-14-500-20 block mb-1">Token<span class="text-red-500">*</span></label>
                <USelectMenu
                  class="w-full"
                  selected-icon="i-selected"
                  trailing-icon="i-dropdown"
                  :ui="{
                    variant: {
                      none: 'bg-white border border-[#D7D9E5] rounded-[48px] py-[10px] px-4 w-full',
                    },
                    icon: {
                      leading: {
                        padding: { xs: 'pl-4 pr-2.5', sm: 'pl-4 pr-2.5' },
                      },
                    },
                  }"
                  :ui-menu="{
                    select: 'cursor-pointer',
                    background: 'bg-white',
                    base: 'relative focus:outline-none overflow-y-auto scroll-py-1',
                    padding: 'p-0',
                    rounded: 'rounded-[16px]',
                    option: {
                      base: 'cursor-pointer text-14-500-20 bg-[#F0F2F5]',
                      inactive: 'bg-white hover:bg-[#F0F2F5] cursor-pointer',
                      padding: 'px-3 py-[10px]',
                      rounded: 'rounded-none',
                      selectedIcon: {
                        base: 'h-[18px] w-[18px]',
                      },
                      empty: 'text-sm',
                    },
                    empty: 'text-sm',
                    default: {
                      selectedIcon: 'i-selected',
                    },
                  }"
                  variant="none"
                  v-model="selectedCurrencyOption"
                  :options="currencyOptions"
                  option-attribute="value"
                >
                  <template #leading>
                    <img v-if="selectedCurrencyOption?.logo" :src="selectedCurrencyOption?.logo" />
                  </template>
                  <template #label>
                    <span
                      v-if="selectedCurrencyOption?.label"
                      class="truncate text-14-500-20 text-[#1C1D23] max-w-[350px] pl-2.5"
                    >
                      {{ selectedCurrencyOption?.label }}
                    </span>
                  </template>
                  <template #option="{ option: currency }">
                    <img :src="currency.logo" alt="logo" />
                    <span class="truncate">{{ currency.label }}</span>
                  </template>
                </USelectMenu>
              </div>
              <!-- Address -->
              <div class="mb-7">
                <label class="text-14-500-20 block mb-1">Address<span class="text-red-500">*</span></label>
                <div class="border border-[#D7D9E5] rounded-[48px] py-[10px] px-4 flex flex-row items-center justify-between gap-0 w-full bg-[#F8F8FA]">
                  <div class="text-[#7A7D89] text-14-500-20 break-all truncate whitespace-nowrap">{{ topupAddress }}</div>
                  <div class="relative flex-shrink-0">
                    <img
                      class="cursor-pointer"
                      @click="handleCopy(topupAddress)"
                      :src="copied ? `/icons/common/copied.svg` : `/icons/common/copy.svg`"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- QR + Attention -->
            <div class="flex flex-col sm:flex-row gap-3 w-full">
              <div class="flex justify-center relative items-center bg-white border border-[#D7D9E5] rounded-[20px] w-full sm:w-[152px] h-[152px] p-2">
                <img class="absolute" style="scale: 0.25" src="~/assets/img/dashboard/qr-logo.svg" alt="" />
                <VueQr v-if="topupAddress" :text="topupAddress" :size="140" :margin="0" />
              </div>
              <div class="flex-1 bg-[#FFF4F0] rounded-[20px] px-[15px] py-3 flex flex-col gap-0 justify-center">
                <div class="flex flex-row items-center gap-2 mb-1">
                  <span class="text-[#1C1D23] text-14-600-20 font-bold">{{ t('dashboard.modals.topup.noteTitle')  }}</span>
                </div>
                <div class="text-12-500-20 text-[#7A7D89]">
                  {{ t('dashboard.modals.topup.note') }}
                </div>
                <div class="text-12-500-20 text-[#FF5524] mt-1">
                  Fee: <span class="font-bold">{{ walletTopupFeeType === FeeAmountType.PERCENT ? (walletTopupFeeValue * 100) + '%' : formatMoneyWithoutDecimals(walletTopupFeeValue, CommonCurrency.USD) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </USlideover>
</template>

<style lang="scss" scoped></style>
