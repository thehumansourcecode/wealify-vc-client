<script setup lang="ts">
import { clippingParents } from './node_modules/@popperjs/core/lib/enums'
import { CommonLanguage } from './types/common'

const { locale, setLocale } = useI18n()

const metadata = {
  name: 'Wealify',
  description: 'Wealify',
  url: 'https://vc.wealify.com',
  icons: ['https://wealify.com/favicon.ico'],
}

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({
  title: metadata.name,
  description: metadata.description,
  ogTitle: metadata.name,
  ogDescription: metadata.description,
  ogImage: `${metadata.url}/social-card.png`,
  twitterImage: `${metadata.url}/social-card.png`,
  twitterCard: 'summary_large_image',
})

setLocale(CommonLanguage.EN)
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications
      :ui="{
        width: 'w-full sm:w-full sm:max-w-[500px]',
      }"
    >
      <template #title="{ title }">
        <span v-html="title" />
      </template>

      <template #description="{ description }">
        <span v-html="description" />
      </template>
    </UNotifications>
    <UModals />
  </div>
</template>
