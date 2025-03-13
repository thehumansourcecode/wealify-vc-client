<script setup lang="ts">
import { PanelTab } from '~/types/common'

const userStore = useUserStore()
const authStore = useAuthStore()
const commonStore = useCommonStore()

const { t } = useI18n()

const userProfile = computed(() => userStore.userProfile)
const activeTab = computed(() => commonStore.activeTab)
</script>

<template>
  <div class="py-4 flex flex-row w-full justify-between items-center pl-10 pr-[60px] flex-none">
    <div class="text-[20px] leading-8">{{ t(`common.title.${activeTab}`) }}</div>
    <div class="flex flex-row items-center">
      <div class="mr-4">EN</div>
      <div class="mr-7">noti</div>
      <div>Profile</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gradient {
  background: linear-gradient(to right, #eee, #cda981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
