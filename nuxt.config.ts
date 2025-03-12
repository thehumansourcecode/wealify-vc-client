import { CommonLanguage } from './types/common'
import i18nConfig from './i18n.config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
  runtimeConfig: {
    private: {
      baseUrl: process.env.BASE_URL,
    },
    public: {
      baseUrl: process.env.BASE_URL,
      landingBaseUrl: process.env.LANDING_BASE_URL,
      telegramBaseUrl: process.env.TELEGRAM_BASE_URL,
      twitterBaseUrl: process.env.TWITTER_BASE_URL,
      projectDocsBaseUrl: process.env.DOCS_BASE_URL,
      redirectBuyUrl: process.env.REDIRECT_BUY_URL,
      dAppsBaseUrl: process.env.DAPPS_BASE_URL,
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    'nuxt-aos',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vee-validate/nuxt',
    'dayjs-nuxt',
  ],

  i18n: {
    vueI18n: '~/i18n.config.ts',
    locales: [CommonLanguage.EN, CommonLanguage.VI], // used in URL path prefix
    defaultLocale: CommonLanguage.EN, // default locale of your project for Nuxt pages and routings,
    lazy: true,
    skipSettingLocaleOnNavigate: true,
  },

  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
  },

  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },

  vite: {
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.error', 'console.warn', 'console.debug', 'console.trace'],
    },
  },

  ui: {
    safelistColors: [
      'primary',
      'red',
      'orange',
      'green',
      'customYellow',
      'customOrange',
      'customBlend',
      'customSilver',
      'customGold',
      'customMG',
      'customDMG',
      'customLE',
      'customSMFC',
      'customGE',
      'customActivePagination',
    ],
  },

  aos: {
    duration: 600,
  },

  colorMode: {
    preference: 'light',
  },

  components: [
    {
      path: '~/components',
    },
    {
      path: '~/components/common',
      pathPrefix: false,
    },
    {
      path: '~/components/forms',
      pathPrefix: false,
    },
    {
      path: '~/components/modal',
      pathPrefix: false,
    },
  ],

  devtools: {
    enabled: true,
  },

  // Change to CS2Agent
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'CS2Agent - The best place to get your favourite skins for cheap.',
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'CS2Agent' },
        { property: 'og:site_name', content: 'CS2Agent' },
        { property: 'og:title', content: 'CS2Agent - The best place to get your favourite skins for cheap.' },
        {
          property: 'og:description',
          content: 'CS2Agent - The best place to get your favourite skins for cheap.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://cs2agent.com' },
        { property: 'og:image', content: '/favicon.ico' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'CS2Agent',
        },
        {
          name: 'twitter:description',
          content: 'CS2Agent - The best place to get your favourite skins for cheap.',
        },
        { name: 'twitter:site', content: 'https://cs2agent.com' },
        {
          name: 'twitter:image',
          content: 'https://cs2agent.com/social-card.png',
        },
        {
          name: 'twitter:image:src',
          content: 'https://cs2agent.com/social-card.png',
        },
        {
          name: 'keywords',
          content: 'CS2Agent, CS2Agent.com, CS2Agent skins, CS2Agent skins for cheap',
        },
        { hid: 'og-type', property: 'og:type', content: 'website' },
        {
          hid: 'og-title',
          property: 'og:title',
          content: 'CS2Agent',
        },
        {
          hid: 'og-desc',
          property: 'og:description',
          content: 'CS2Agent - The best place to get your favourite skins for cheap.',
        },
        {
          hid: 'og-image',
          property: 'og:image',
          content: 'https://cs2agent.com/social-card.png',
        },
        {
          hid: 'og-url',
          property: 'og:url',
          content: 'https://cs2agent.com/social-card.png',
        },
        { hid: 't-type', name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap',
        },
        { rel: 'canonical', href: 'https://cs2agent.com' },
        { rel: 'alternate', hreflang: 'en', href: 'https://cs2agent.com' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://cs2agent.com' },
      ],
    },
  },

  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
  },

  site: {
    url: 'https://cs2agent.com',
    name: 'Best place to buy skins',
  },

  schemaOrg: {
    defaults: false,
  },

  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ]
  },

  compatibilityDate: '2024-08-11',
})
