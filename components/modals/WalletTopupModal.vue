<script setup lang="ts">
import { formatMoneyWithoutDecimals } from '~/common/functions'
import { CommonCurrency, FeeAmountType } from '~/types/common'
import { TransactionCryptocurrency, TransactionNetwork } from '~/types/dashboard'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'
const { copy, copied } = useClipboard()
const toast = useToast()
import { showToast, ToastType } from '~/common/functions'
const { fetchWalletInfo } = usePaymentStore()
const { walletInfo } = storeToRefs(usePaymentStore())
const dashboardStore = useDashboardStore()
const commonStore = useCommonStore()

onMounted(async () => await Promise.all([commonStore.getFee()]))

const walletTopupFeeValue = computed(() => commonStore.feeList?.TOP_UP_WALLET.value || 0)
const walletTopupFeeType = computed(() => commonStore.feeList?.TOP_UP_WALLET.type)

const { t } = useI18n()

const topupAddress = computed(() => {
  if (!walletInfo.value || !selectedNetworkOption.value){
    return ''
  }
  return walletInfo.value.address[selectedNetworkOption.value.value]
})

const networkOptions = ref([])
const selectedNetworkOption = ref(undefined)
const currencyOptions = ref([])
const selectedCurrencyOption = ref(undefined)

function handleCopy(value: string) {
  copy(value)
  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

const init = async ()=>{
  const result = await fetchWalletInfo()
  if (!result.success) {
    showToast(ToastType.FAILED, result.message)
    return
  }

  networkOptions.value = walletInfo.value?.network.map((network)=>{
    return {
      logo: `/icons/common/${network}.svg`,
      value: network,
      label: t(`dashboard.modals.topup.label.${network}`),
    }
  })

  selectedNetworkOption.value = networkOptions.value[0]
  currencyOptions.value = walletInfo.value?.token.map((token)=>{
    return {
      logo: `/icons/common/${token}.svg`,
      value: token,
      label: t(`dashboard.modals.topup.label.${token}`),
    }
  })

  selectedCurrencyOption.value = currencyOptions.value[0]
}


await init()

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
          {{ t(`dashboard.modals.topup.feePercent`, { fee: roundTo(walletTopupFeeValue * 100,3) }) }}
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
