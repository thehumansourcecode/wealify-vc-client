<script setup lang="ts">
import '~/assets/css/style.scss'
import { useCommonStore } from '~/stores/common'
import flag_EN from '~/assets/img/flags/en.svg'
import { CommonLanguage } from '~/types/common'

const { t, setLocale } = useI18n()
const config = useRuntimeConfig()
const userStore = useUserStore()

onMounted(() => {
  userStore.getProfile()
})

const languageOptions = ref([
  {
    value: CommonLanguage.EN,
    label: t(`common.language.${CommonLanguage.EN}`),
    img: flag_EN,
  },
])

const selectedLanguage = ref(languageOptions.value[0])
</script>

<template>
  <div class="flex flex-row h-[100vh]">
    <LeftPanel />
    <div class="flex flex-col w-full max-h-[100vh] overflow-x-hidden">
      <Header />
      <slot />
    </div>
  </div>
  <Modals />
  <Slideovers />
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
