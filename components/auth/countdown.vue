<script setup lang="ts">
// Define props with TypeScript
const props = defineProps<{
  target: string | Date | number
  onComplete?: () => void
}>()

// Use the countdown composable
const { time } = useCountdown(props.target, props.onComplete)
</script>
<template>
  <span> <slot v-if="time > 0" name="countdown" :time="time"></slot> <slot v-else name="complete"></slot></span>
</template>
