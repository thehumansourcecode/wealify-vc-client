<script setup lang="ts">
import { formatMoneyWithoutDecimals } from '~/common/functions'
import { CommonCurrency, FeeAmountType } from '~/types/common'
import { TransactionCryptocurrency, TransactionNetwork } from '~/types/dashboard'
import VueQr from 'vue-qr/src/packages/vue-qr.vue'

interface NetworkOption {
  logo: string
  value: string
  label: string
}

interface CurrencyOption {
  logo: string
  value: string
  label: string
}

const { copy, copied } = useClipboard()
const toast = useToast()
const { fetchWalletInfo } = usePaymentStore()
const { walletInfo } = storeToRefs(usePaymentStore())
const dashboardStore = useDashboardStore()
const commonStore = useCommonStore()


onMounted(async () => await Promise.all([commonStore.getFee()]))

const walletTopupFeeValue = computed(() => commonStore.feeList?.TOP_UP_WALLET.value || 0)
const walletTopupFeeType = computed(() => commonStore.feeList?.TOP_UP_WALLET?.type)

const { t } = useI18n()

const topupAddress = computed(() => {
  if (!walletInfo.value || !selectedNetworkOption.value){
    return ''
  }
  return walletInfo.value.address[selectedNetworkOption.value.value]
})

const networkOptions = ref<NetworkOption[]>([])
const selectedNetworkOption = ref<NetworkOption | undefined>(undefined)

const selectedCurrencyOption = ref<CurrencyOption | undefined>(undefined)

function handleCopy(value: string) {
  copy(value)
  toast.clear()
  toast.add({
    title: t('common.toast.copy'),
    avatar: { src: '/icons/common/toast-success.svg' },
    timeout: 5000,
  })
}

function handleClose() {
  dashboardStore.toggleWalletTopupModal(false)
}

await fetchWalletInfo()
networkOptions.value = walletInfo.value?.network.map((network)=>{
  return {
    logo: `/icons/common/${network}.svg`,
    value: network,
    label: t(`dashboard.modals.topup.label.${network}`),
  }
}) 
selectedNetworkOption.value = networkOptions.value[0]
console.log(selectedNetworkOption.value.value)
const currencyOptions = computed(() => {
  return selectedNetworkOption.value.value == TransactionNetwork.TRON ? [
    {
      logo: `/icons/common/${TransactionCryptocurrency.USDT}.svg`,
      value: TransactionCryptocurrency.USDT,
      label: t(`dashboard.modals.topup.label.${TransactionCryptocurrency.USDT}`),
    },
]: walletInfo.value?.token.map((token)=>{
    return {
      logo: `/icons/common/${token}.svg`,
      value: token,
      label: t(`dashboard.modals.topup.label.${token}`),
    }
  })
})
selectedCurrencyOption.value = currencyOptions.value[0]



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
      width: 'w-full sm:w-[420px]',
      background: 'bg-white',
    }"
    @close-prevented="handleClose"
  >
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between px-6 pt-6 pb-4">
        <div class="text-[22px] font-semibold text-[#1C1D23]">{{ t('dashboard.modals.topup.title') }}</div>
        <button class="text-gray-400 hover:text-gray-500" @click="handleClose">
          <UIcon name="i-heroicons-x-mark-20-solid" class="w-6 h-6" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <!-- Network -->
        <div class="mb-4">
          <div class="text-[13px] font-medium text-[#1C1D23] mb-1 flex items-center">
            {{ t('dashboard.modals.topup.label.network') }}
            <span class="pl-1 text-[#ff5c5c]">*</span>
          </div>
          <USelectMenu
            selected-icon="i-selected"
            trailing-icon="i-dropdown"
            :ui="{
              variant: {
                none: 'bg-white border border-[#D7D9E5] rounded-[12px] py-[10px] px-4 w-full',
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
              rounded: 'rounded-[12px]',
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
              <img v-if="selectedNetworkOption?.logo" :src="selectedNetworkOption?.logo" class="w-5 h-5 rounded-full" />
            </template>
            <template #label>
              <span v-if="selectedNetworkOption?.label" class="truncate text-14-500-20 text-[#1C1D23] max-w-[350px] pl-2.5">
                {{ selectedNetworkOption?.label }}
              </span>
            </template>
            <template #option="{ option: network }">
              <img :src="network.logo" alt="logo" class="w-5 h-5 rounded-full mr-2" />
              <span class="truncate">{{ network.label }}</span>
            </template>
          </USelectMenu>
        </div>
        <!-- Token -->
        <div class="mb-4">
          <div class="text-[13px] font-medium text-[#1C1D23] mb-1 flex items-center">
            {{ t('dashboard.modals.topup.label.currency') }}
            <span class="pl-1 text-[#ff5c5c]">*</span>
          </div>
          <USelectMenu
            selected-icon="i-selected"
            trailing-icon="i-dropdown"
            :ui="{
              variant: {
                none: 'bg-white border border-[#D7D9E5] rounded-[12px] py-[10px] px-4 w-full',
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
              rounded: 'rounded-[12px]',
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
              <img v-if="selectedCurrencyOption?.logo" :src="selectedCurrencyOption?.logo" class="w-5 h-5 rounded-full" />
            </template>
            <template #label>
              <span v-if="selectedCurrencyOption?.label" class="truncate text-14-500-20 text-[#1C1D23] max-w-[350px] pl-2.5">
                {{ selectedCurrencyOption?.label }}
              </span>
            </template>
            <template #option="{ option: currency }">
              <img :src="currency.logo" alt="logo" class="w-5 h-5 rounded-full mr-2" />
              <span class="truncate">{{ currency.label }}</span>
            </template>
          </USelectMenu>
        </div>
        <!-- Address -->
        <div class="mb-4">
          <div class="text-[13px] font-medium text-[#1C1D23] mb-1 flex items-center">
            {{ t('dashboard.modals.topup.label.address') }}
            <span class="pl-1 text-[#ff5c5c]">*</span>
          </div>
          <div class="relative flex items-center">
            <input
              class="w-full border truncate border-[#D7D9E5] rounded-[12px] py-[10px] px-4 pr-10 text-[#7A7D89] text-14-500-20 bg-[#F8F9FB] outline-none select-all"
              :value="topupAddress"
              readonly
            />
            <button class="absolute right-2 top-1/2 -translate-y-1/2" @click="handleCopy(topupAddress)">
              <img :src="copied ? '/icons/common/copied.svg' : '/icons/common/copy.svg'" class="w-5 h-5" />
            </button>
          </div>
        </div>
        <!-- QR + Warning -->
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
                  {{ t(`dashboard.modals.topup.note.${selectedNetworkOption.value}`) }}
                </div>
                <div class="text-12-500-20 text-[#FF5524] mt-1">
                  Fee: <span class="font-bold">{{ walletTopupFeeType === FeeAmountType.PERCENT ? (roundTo(walletTopupFeeValue * 100,3)) + '%' : formatMoneyWithoutDecimals(walletTopupFeeValue, CommonCurrency.USD) }}</span>
                </div>
              </div>
            </div>
      </div>
    </div>
  </USlideover>
</template>

<style lang="scss" scoped>
input[readonly] {
  cursor: pointer;
}
</style>
