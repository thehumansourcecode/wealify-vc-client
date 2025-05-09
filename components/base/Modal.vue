<script lang="ts" setup>
defineProps({
  label: String,
  loading: Boolean,
})
const emit = defineEmits(['close-prevented'])

function onClosePrevented() {
  emit('close-prevented')
}
</script>
<template>
  <UModal
    :prevent-close="true"
    class="modal"
    @close-prevented="onClosePrevented"
    :ui="{
      overlay: {
        background: 'bg-[#1c1d23]/30',
      },
      container: 'flex min-h-full items-center sm:items-center justify-center text-center',
      rounded: 'rounded-xl',
      background: '',
      width: 'w-[max-content] sm:max-w-[1000px]',
      margin: 'sm:my-0',
    }"
  >
    <div class="p-4 lg:p-8 bg-white rounded-[20px] flex flex-col gap-2 lg:gap-7">
      <div v-if="label" class="w-full flex flex-row justify-between items-center">
        <div class="text-20-600-32">{{ label }}</div>
        <img
          class="cursor-pointer hover:opacity-70"
          src="~/assets/img/common/close.svg"
          alt=""
          @click="onClosePrevented()"
        />
      </div>
      <slot></slot>
    </div>
  </UModal>
</template>

<style scoped lang="scss"></style>
