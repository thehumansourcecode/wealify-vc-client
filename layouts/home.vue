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
  <div class="flex flex-row">
    <LeftPanel />
    <div class="flex flex-col w-full ml-[40px] mr-[60px]">
      <Header />
      <slot />
    </div>
  </div>
  <Modals />
</template>

<style lang="scss">
.profile-scrollable {
  height: calc(100vh - 126px);
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cda981;
  }
  &::-webkit-scrollbar-track {
    background: #261608;
  }
}
</style>
