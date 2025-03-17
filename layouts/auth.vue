<script setup lang="ts">
import '~/assets/css/style.scss'
</script>

<template>
  <div class="">
    <slot />
  </div>
</template>

<style lang="scss">
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: #888888;
}
::-webkit-scrollbar-track {
  background: #f0f0f0;
}
</style>
