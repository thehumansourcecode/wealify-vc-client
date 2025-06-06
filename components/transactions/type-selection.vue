<script setup lang="ts">
import { shortenString } from '~/common/functions'
import { TransactionVCType, WalletType } from '~/types/transactions'

interface Option {
  title: string
  value: WalletType | TransactionVCType
}

interface OptionGroup {
  title: string
  options: Array<Option>
}

const model = defineModel<Array<WalletType | TransactionVCType>>({ default: [] })
const open = ref<boolean>(false)
const groups = ref<Array<OptionGroup>>([
  {
    title: 'Wallet Type',
    options: [
      {
        title: 'Wealify Wallet',
        value: WalletType.MAIN,
      },
      {
        title: 'Virtual Card Wallet',
        value: WalletType.VC,
      },
    ],
  },
  {
    title: 'Wealify Wallet',
    options: [
      {
        title: 'Top-up',
        value: TransactionVCType.TOP_UP,
      },
      {
        title: 'Withdraw',
        value: TransactionVCType.WITHDRAWAL,
      },
      {
        title: 'Spend',
        value: TransactionVCType.PAYMENT,
      },
    ],
  },
])

const options = computed<Array<Option>>(() =>
  Object.values(groups.value).reduce<Array<Option>>((list, item) => [...list, ...item.options], []),
)

const displayValue = computed<string>(() => {
  const selectedOptions = options.value.filter(({ value }) => model.value.includes(value))
  return shortenString(selectedOptions.map(({ title }) => title).join(','))
})

const reset = () => {
  model.value = []
}

const isVCCardEnabled = computed<boolean>(() => {
  return model.value.includes(WalletType.VC)
})

const onSelect = (value: WalletType | TransactionVCType) => {
  if (model.value.includes(value)) {
    model.value = model.value.filter(val => {
      if (value == WalletType.VC) return val != TransactionVCType.PAYMENT && val != value
      return val != value
    })
  } else {
    model.value = [...model.value, value]
  }
}
</script>
<template>
  <UPopover mode="hover" :ui="{ background: 'bg-white', ring: 'ring-0' }">
    <div
      class="min-w-[140px] sm:min-w-[160px] inline-flex justify-start items-center gap-1.5 bg-[#F0F2F5] border border-[#D7D9E5] text-[#7A7D89] text-12-500-20 rounded-[36px] py-1.5 sm:py-[7px] px-2 sm:px-3"
    >
      <div
        class="flex-1 justify-center text-[#7a7c89] text-11 sm:text-12-500-20 font-medium font-['Manrope'] leading-tight cursor-pointer"
      >
        {{ model.length > 0 ? displayValue : 'Type' }}
      </div>
      <img
        v-if="model.length < 1"
        src="/assets/img/icons/dropdown.svg"
        class="transition-transform w-3 h-3 sm:w-auto sm:h-auto"
        :class="[open && 'transform rotate-180']"
      />
      <img v-else @click="reset()" class="cursor-pointer w-3 h-3 sm:w-auto sm:h-auto" src="/assets/img/icons/clear.svg" alt="" />
    </div>
    <template #panel>
      <div
        class="relative bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(0,0,0,0.11)] outline outline-[1.50px] outline-offset-[-1.50px] outline-[#d6d8e5]"
      >
        <div class="flex flex-col sm:flex-row justify-between align-center gap-4 sm:gap-5 p-3 sm:p-5">
          <template v-for="(group, index) in groups" :key="index">
            <div class="flex-1 min-w-[160px] sm:min-w-[200px] flex flex-col gap-3 sm:gap-5">
              <div class="text-[#7a7c89] text-11 sm:text-12-500-20 font-medium leading-tight">
                {{ group.title }}
              </div>
              <div class="flex flex-col justify-center items-start gap-3 sm:gap-5">
                <div
                  v-for="(option, index) in group.options"
                  :key="index + 'z'"
                  class="inline-flex items-center gap-2"
                  :class="[index % 2 == 0 ? 'justify-start' : 'justify-center']"
                >
                  <UCheckbox
                    @click="onSelect(option.value)"
                    :disabled="!isVCCardEnabled && option.value == TransactionVCType.PAYMENT"
                    :model-value="model.includes(option.value)"
                    :ui="{
                      base: 'cursor-pointer',
                    }"
                  />
                  <div
                    @click="onSelect(option.value)"
                    class="justify-center text-[#1b1c23] text-12 sm:text-14-500-20 font-semibold font-['Manrope'] leading-tight cursor-pointer"
                    :class="!isVCCardEnabled && option.value == TransactionVCType.PAYMENT ? 'opacity-50' : ''"
                  >
                    {{ option.title }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="index % 2 == 0" class="w-0 h-24 sm:h-32 origin-top-left border border-[#d6d8e5] hidden sm:block" />
          </template>
        </div>
      </div>
    </template>
  </UPopover>
</template>
