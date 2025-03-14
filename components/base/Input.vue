<script setup lang="ts">
defineProps({
  leading: Boolean,
  leadingImg: String,
  trailing: Boolean,
  trailingImg: String,
})
</script>

<template>
  <UInput
    class="w-full"
    autocomplete="off"
    variant="none"
    :ui="{
      padding: {
        sm: 'pr-7 pl-1.5 py-1.5',
      },
      leading: {
        padding: {
          sm: 'ps-10',
        },
      },
      icon: {
        leading: {
          padding: {
            sm: 'pl-4 pr-2.5',
          },
        },
      },
    }"
  >
    <template #leading>
      <img v-if="leading" :src="leadingImg" alt="" />
    </template>
  </UInput>
</template>

<style lang="scss">
.referral-input-field {
  height: 46px;
  box-shadow: none;
  border-radius: 6px;
  color: #fca847;
  font-weight: 300;
  font-size: 14px;
  line-height: 23px;
  &::placeholder {
    color: #fca847;
    opacity: 0.7;
    font-size: 14px;
    font-family: ClashDisplay-Medium, sans-serif;
  }
  font-family: ClashDisplay-Medium, sans-serif;
}

.market-input-field {
  height: 38px;
  box-shadow: none;
  border: 1px solid #cda981;
  background: transparent;
  border-radius: 6px;
  color: #cda981;
  font-weight: 300;
  font-size: 14px;
  line-height: 23px;
  font-family: ClashDisplay-Medium, sans-serif;
  &:focus {
    border: 1px solid #cda981 !important;
  }
  &:hover {
    border: 1px solid #cda981 !important;
  }
  &::placeholder {
    opacity: 0.7;
    color: #cda981;
    font-size: 14px;
    font-family: ClashDisplay-Medium, sans-serif;
  }
}

.input-field {
  height: 44px;
  box-shadow: none;
  border: 1px solid #d7d9e5;
  background: white;
  border-radius: 49px;
  color: #7a7d89;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  &:focus {
    border: 1px solid #c6c8d4 !important;
  }
  &:hover {
    border: 1px solid #c6c8d4 !important;
  }
  &::placeholder {
    color: #7a7d89;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }
}

.transparent {
  background: transparent;
  border: none !important;
  &:focus {
    border: none !important;
  }
  &:hover {
    border: none !important;
  }
}
</style>
