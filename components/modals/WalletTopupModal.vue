<script setup lang="ts">
import { formatMoneyWithoutDecimals } from '~/common/functions'
import { CommonCurrency, FeeAmountType } from '~/types/common'
import { TransactionCryptocurrency, TransactionNetwork } from '~/types/dashboard'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
const { copy, copied } = useClipboard()
const toast = useToast()

const dashboardStore = useDashboardStore()
const commonStore = useCommonStore()

onMounted(async () => await Promise.all([commonStore.getFee()]))

const walletTopupFeeValue = computed(() => commonStore.feeList?.TOP_UP_WALLET.value || 0)
const walletTopupFeeType = computed(() => commonStore.feeList?.TOP_UP_WALLET.type)

const { t } = useI18n()

const topupAddress = computed(() => {
  if (selectedNetworkOption.value.value === TransactionNetwork.SOLANA) {
    return '2YzStCUvA2MaDxcuW8dJc4in1DY45GfwEzUnkPC87EA9'
  } else if (selectedNetworkOption.value.value === TransactionNetwork.ETHEREUM) {
    return '0x922cE1a5310DcEBe7CBF9eC1AcC16694b7007Fba'
  } else if (selectedNetworkOption.value.value === TransactionNetwork.TRON) {
    return 'TCJK2XuDrGd7BD8hxqS9PtsGYDFw9XJP8Z'
  } else return ''
})

const networkOptions = ref([
  {
    logo: `/icons/common/${TransactionNetwork.SOLANA}.svg`,
    value: TransactionNetwork.SOLANA,
    label: t(`dashboard.modals.topup.label.${TransactionNetwork.SOLANA}`),
  },
  {
    logo: `/icons/common/${TransactionNetwork.TRON}.svg`,
    value: TransactionNetwork.TRON,
    label: t(`dashboard.modals.topup.label.${TransactionNetwork.TRON}`),
  },
  {
    logo: `/icons/common/${TransactionNetwork.ETHEREUM}.svg`,
    value: TransactionNetwork.ETHEREUM,
    label: t(`dashboard.modals.topup.label.${TransactionNetwork.ETHEREUM}`),
  },
])

const selectedNetworkOption = ref(networkOptions.value[0])

const currencyOptions = ref([
  {
    logo: `/icons/common/${TransactionCryptocurrency.USDT}.svg`,
    value: TransactionCryptocurrency.USDT,
    label: t(`dashboard.modals.topup.label.${TransactionCryptocurrency.USDT}`),
  },
  {
    logo: `/icons/common/${TransactionCryptocurrency.USDC}.svg`,
    value: TransactionCryptocurrency.USDC,
    label: t(`dashboard.modals.topup.label.${TransactionCryptocurrency.USDC}`),
  },
])

const selectedCurrencyOption = ref(currencyOptions.value[0])

function handleCopy(value: string) {
  copy(value)
  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}
</script>

<template>
  <BaseModal :label="t('dashboard.modals.topup.title')" @close-prevented="dashboardStore.toggleWalletTopupModal(false)">
    <div class="flex flex-row items-start gap-7">
      <div>
        <!-- Network -->
        <div class="text-12-500-20 mb-1">
          <span>{{ t('dashboard.modals.topup.label.network') }}</span>
          <span class="pl-1 text-[#ff5c5c]">*</span>
        </div>
        <USelectMenu
          selected-icon="i-selected"
          trailing-icon="i-dropdown"
          :ui="{
            variant: {
              none: 'bg-white border border-[#D7D9E5] rounded-[48px] py-[10px] px-4',
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

        <!-- Currency -->
        <div class="text-12-500-20 mt-4 mb-1">
          <span>{{ t('dashboard.modals.topup.label.currency') }}</span>
          <span class="pl-1 text-[#ff5c5c]">*</span>
        </div>
        <USelectMenu
          selected-icon="i-selected"
          trailing-icon="i-dropdown"
          :ui="{
            variant: {
              none: 'bg-white border border-[#D7D9E5] rounded-[48px] py-[10px] px-4',
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

        <!-- Address -->
        <div class="text-12-500-20 mt-4 mb-1">
          <span>{{ t('dashboard.modals.topup.label.address') }}</span>
          <span class="pl-1 text-[#ff5c5c]">*</span>
        </div>
        <div
          class="border border-[#D7D9E5] rounded-[48px] py-[10px] px-4 flex flex-row items-center justify-between gap-4"
        >
          <div class="text-[#7A7D89] text-14-500-20 w-[400px]">{{ topupAddress }}</div>
          <div class="relative">
            <img
              class="cursor-pointer"
              @click="handleCopy(topupAddress)"
              :src="copied ? `/icons/common/copied.svg` : `/icons/common/copy.svg`"
              alt=""
            />
          </div>
        </div>
        <div class="text-12-500-20 text-[#7A7D89] mt-4 w-[400px]">{{ t(`dashboard.modals.topup.note`) }}</div>
        <div v-if="walletTopupFeeType === FeeAmountType.PERCENT" class="text-16-600-20 text-[#FF5524] mt-4">
          {{ t(`dashboard.modals.topup.feePercent`, { fee: walletTopupFeeValue * 100 }) }}
        </div>
        <div v-else-if="walletTopupFeeType === FeeAmountType.FIXED" class="text-16-600-20 text-[#FF5524] mt-4">
          {{
            t(`dashboard.modals.topup.feePercent`, {
              fee: formatMoneyWithoutDecimals(walletTopupFeeValue, CommonCurrency.USD),
            })
          }}
        </div>
      </div>
      <div
        class="py-[22px] px-[19px] rounded-[20px] border border-[#D7D9E5] relative w-[240px] h-[246px] flex items-center justify-center"
      >
        <img class="absolute" style="scale: 0.65" src="~/assets/img/dashboard/qr-logo.svg" alt="" />
        <VueQr v-if="topupAddress" :text="topupAddress" :size="200" :margin="0" />
      </div>
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped></style>
