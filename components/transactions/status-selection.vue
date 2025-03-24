<script setup lang="ts">
import { shortenString } from '~/common/functions'
import { TransactionStatus } from '~/types/transactions'

interface Option {
  title: string
  value: Array<TransactionStatus>
}

const model = defineModel<Array<TransactionStatus>>({ default: [] })
const open = ref<boolean>(false)
const options = computed<Array<Option>>(() => [
  {
    title: 'Process',
    value: [TransactionStatus.PENDING, TransactionStatus.PROCESS, TransactionStatus.WAITING],
  },
  {
    title: 'Success',
    value: [TransactionStatus.APPROVED],
  },
  {
    title: 'Failed',
    value: [TransactionStatus.REJECTED, TransactionStatus.CANCELLED],
  },
])

const displayValue = computed<string>(() => {
  const selectedOptions = options.value.filter(isOptionSelected)
  return shortenString(selectedOptions.map(({ title }) => title).join(','))
})

const isOptionSelected = (option: Option) => {
  return option.value.some(status => model.value.includes(status))
}

const reset = () => {
  model.value = []
}

const onSelect = (option: Option) => {
  if (isOptionSelected(option)) {
    model.value = model.value.filter(status => !option.value.includes(status))
  } else {
    model.value = [...model.value, ...option.value]
  }
}
</script>
<template>
  <UPopover mode="hover" :ui="{ background: 'bg-white', ring: 'ring-0' }">
    <div
      class="min-w-[160px] inline-flex justify-start items-center gap-1.5 bg-[#F0F2F5] border border-[#D7D9E5] text-[#7A7D89] text-12-500-20 rounded-[36px] py-[7px] px-3"
    >
      <div
        class="flex-1 justify-center text-[#7a7c89] text-xs font-medium font-['Manrope'] leading-tight cursor-pointer"
      >
        {{ model.length > 0 ? displayValue : 'Status' }}
      </div>
      <img
        v-if="model.length < 1"
        src="/assets/img/icons/dropdown.svg"
        class="transition-transform"
        :class="[open && 'transform rotate-180']"
      />
      <img v-else @click="reset()" class="cursor-pointer" src="/assets/img/icons/clear.svg" alt="" />
    </div>
    <template #panel>
      <div
        class="relative bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(0,0,0,0.11)] outline outline-[1.50px] outline-offset-[-1.50px] outline-[#d6d8e5]"
      >
        <div class="flex flex-col justify-center items-start gap-5 p-5">
          <div v-for="option in options" class="inline-flex items-center gap-2 justify-star">
            <UCheckbox
              @click="onSelect(option)"
              :model-value="isOptionSelected(option)"
              :ui="{
                base: 'cursor-pointer',
              }"
            />
            <div class="justify-center text-[#1b1c23] text-sm font-semibold font-['Manrope'] leading-tight">
              {{ option.title }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>
