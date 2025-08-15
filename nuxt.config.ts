import { CommonLanguage } from './types/common'

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
    },
    app: {
      auth: {
        api: {
          baseUrl: process.env.BASE_URL,
        },
        pages: {
          home: '/',
          signIn: '/auth/sign-in',
          signUp: '/auth/sign-up',
        },
        accessToken: {
          maxAgeInSeconds: 1000,
          sameSiteAttribute: true,
        },
        refreshToken: {
          maxAgeInSeconds: 1000,
          sameSiteAttribute: true,
        },
        session: {
          enableRefreshOnWindowFocus: true,
        },
        globalAppMiddleware: true,
      },
    },
  },

  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    'nuxt-aos',
    '@nuxtjs/seo',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vee-validate/nuxt',
    'dayjs-nuxt',
  ],

  plugins: ['~/plugins/auth.plugin', '~/plugins/element-plus.plugin','~/plugins/apexcharts.ts'],

  i18n: {
    vueI18n: '~/i18n.config.ts',
    locales: [CommonLanguage.EN, CommonLanguage.VI], // used in URL path prefix
    defaultLocale: CommonLanguage.EN, // default locale of your project for Nuxt pages and routings,
    lazy: true,
    skipSettingLocaleOnNavigate: true,
    detectBrowserLanguage: false,
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
    safelistColors: ['primary', 'red', 'orange', 'green'],
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
      path: '~/components/modals',
      pathPrefix: false,
    },
    {
      path: '~/components/slideovers',
      pathPrefix: false,
    },
  ],

  devtools: {
    enabled: false,
  },

  // Change to Wealify
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Wealify',
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'Wealify' },
        { property: 'og:site_name', content: 'Wealify' },
        { property: 'og:title', content: 'Wealify' },
        {
          property: 'og:description',
          content: 'Wealify',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://Wealify.com' },
        { property: 'og:image', content: '/favicon.ico' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'Wealify',
        },
        {
          name: 'twitter:description',
          content: 'Wealify',
        },
        { name: 'twitter:site', content: 'https://Wealify.com' },
        {
          name: 'twitter:image',
          content: 'https://Wealify.com/social-card.png',
        },
        {
          name: 'twitter:image:src',
          content: 'https://Wealify.com/social-card.png',
        },
        {
          name: 'keywords',
          content: 'Wealify',
        },
        { hid: 'og-type', property: 'og:type', content: 'website' },
        {
          hid: 'og-title',
          property: 'og:title',
          content: 'Wealify',
        },
        {
          hid: 'og-desc',
          property: 'og:description',
          content: 'Wealify',
        },
        {
          hid: 'og-image',
          property: 'og:image',
          content: 'https://Wealify.com/social-card.png',
        },
        {
          hid: 'og-url',
          property: 'og:url',
          content: 'https://Wealify.com/social-card.png',
        },
        { hid: 't-type', name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap',
        },
        { rel: 'canonical', href: 'https://Wealify.com' },
        { rel: 'alternate', hreflang: 'en', href: 'https://Wealify.com' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://Wealify.com' },
      ],
    },
  },

  robots: {
    blockNonSeoBots: true,
    blockAiBots: true,
  },

  site: {
    url: 'https://www.wealify.com',
    name: '',
  },

  schemaOrg: {
    defaults: false,
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  compatibilityDate: '2024-08-11',
})
