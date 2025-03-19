<script setup lang="ts">
import PinInput from '../pin-input/index.vue'
const pin = defineModel<string>('value', { default: '' })
const props = defineProps<{
  onComplete: (value: string) => void
}>()
</script>
<template>
  <PinInput
    ref="pinInput"
    class="flex flex-row justify-between gap-1"
    :input-classes="[
      'w-[68px] h-[68px] relative rounded-[49px] text-center justify-center p-2',
      'border-[1.50px] focus:border-[#ec2c37] border-[#d6d8e5]',
      `text-[#1b1c23] text-2xl font-semibold leading-9`,
    ]"
    input-type="letter-numeric"
    input-mode="numeric"
    :num-inputs="6"
    v-model:value="pin"
    :should-auto-focus="true"
    :should-focus-order="true"
    :placeholder="[]"
    @on-complete="() => props.onComplete(pin)"
    @update:value="pin = $event"
  />
</template>
