<script setup lang="ts">
const metadata = {
  name: 'CS2Agent',
  description: 'CS2Agent',
  url: 'https://cs2agent.com',
  icons: ['https://cs2agent.com/favicon.ico'],
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
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications>
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
