<script setup lang="ts">
// Define the cardPurpose prop, assuming it’s passed to the component
const props = defineProps({
  text: {
    type: String,
  },
  width: {
    type: String,
  },
})

// Refs for the text element and truncation state
const truncatedText = ref()
const isTruncated = ref(false)

// Function to check if the text is truncated
const checkTruncation = () => {
  const el = truncatedText.value
  if (el) {
    isTruncated.value = el.scrollWidth > el.clientWidth
  }
}

// Check truncation on mount and after window resize
onMounted(() => {
  checkTruncation()
  window.addEventListener('resize', checkTruncation)
})

// Clean up the resize event listener
onUnmounted(() => {
  window.removeEventListener('resize', checkTruncation)
})

// Watch for changes in cardPurpose and recheck truncation
watch(
  () => props.text,
  async () => {
    await nextTick() // Wait for DOM update
    checkTruncation()
  },
)
</script>

<template>
  <UTooltip
    :text="isTruncated ? text : ''"
    :popper="{ placement: 'top' }"
    :ui="{
      background: 'bg-[#1C1D23]',
      width: width ? width : 'max-w-[252px]',
      color: 'text-[#FFF]',
      base: 'px-3 py-2 h-[max-content]  text-xs font-medium text-clip text-center',
      ring: 'ring-0',
      arrow: { background: 'before:bg-[#1C1D23]' },
    }"
  >
    <div ref="truncatedText" class="truncate">{{ text }}</div>
  </UTooltip>
</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
