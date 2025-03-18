<script setup lang="ts">
import { PinInput } from '#components'
const pinInput = ref<InstanceType<typeof PinInput> | null>(null)
const bindValue = defineModel<string>('value', { default: '' })
</script>

<template>
  <PinInput
    ref="pinInput"
    class="flex flex-row justify-between gap-2"
    :input-classes="[
      'w-[68px] h-[68px] relative rounded-[49px] text-center justify-center p-2',
      'border-[1.50px] border-[#ec2c37]',
      `text-[#1b1c23] text-2xl font-semibold font-['Manrope'] leading-9`,
    ]"
    input-type="letter-numeric"
    input-mode="numeric"
    :num-inputs="6"
    v-model:value="bindValue"
    :should-auto-focus="true"
    :should-focus-order="true"
    :placeholder="[]"
    @update:value="bindValue = $event"
  />
</template>
