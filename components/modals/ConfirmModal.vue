<script setup lang="ts">
const { t } = useI18n()
const cardStore = useCardStore()

const { 
  isPreventClose
} = storeToRefs(cardStore)
defineProps({
  title: String,
  message: String,
  cancelLabel: String,
  confirmLabel: String,
  loading: Boolean,
  bgConfirm: {
    type: String,
    default: '!bg-[#1C1D23] hover:bg-[#1C1D23]',
  },
})
const isOpen = defineModel()
const emit = defineEmits(['update:modelValue', 'confirm'])

const closeModal = () => {
  emit('update:modelValue', false)
}

const confirmModal = () => {
  emit('confirm')
}

watch(
  isOpen,
  (v) => {
    if(!v){
      isPreventClose.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <UModal
    class="modal-xs"
    v-model="isOpen"
    :ui="{
      overlay: {
        background: 'bg-gray-200/20',
      },
      container: 'flex min-h-full items-center sm:items-center justify-center text-center',
      rounded: 'rounded-xl',
      background: '',
      width: 'w-[max-content] sm:max-w-[516px]',
      margin: 'sm:my-0',
    }"
  >
    <div class="p-7 bg-white rounded-[20px] flex flex-col">
      <div class="w-full flex flex-row justify-between items-center mb-[14px]">
        <div class="manrope text-xl font-semibold leading-9 lg:text-2xl">{{ title }}</div>
        <img class="cursor-pointer hover:opacity-70" src="~/assets/img/common/close.svg" @click="closeModal()" />
      </div>
      <div class="manrope font-medium text-[#7A7D89] text-[12px] mb-[20px] lg:text-[14px] lg:mb-[28px]">{{ message }}</div>
      <div class="flex justify-center gap-3">
        <UButton
          @click="closeModal"
          :label="cancelLabel"
          class="manrope flex justify-center rounded-[12px] lg:rounded-[49px] min-w-[100px] bg-[#F0F2F5] hover:bg-[#F0F2F5] p-3 xl:min-w-[223px] font-semibold text-[#1C1D23]"
        ></UButton>
        <UButton
          :label="confirmLabel"
          :loading="loading"
          @click="confirmModal"
          class="manrope flex justify-center rounded-[12px] lg:rounded-[49px] p-3 min-w-[100px] xl:min-w-[223px] font-semibold text-[#FFFFFF]"
          :class="bgConfirm"
        ></UButton>
      </div>
    </div>
  </UModal>
</template>
