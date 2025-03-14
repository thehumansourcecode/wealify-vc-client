import dashboardEn from './i18n/en/dashboard'
import dashboardVi from './i18n/vi/dashboard'
import commonEn from './i18n/en/common'
import commonVi from './i18n/vi/common'

import { CommonLanguage } from './types/common'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: CommonLanguage.EN,
  defaultLocale: CommonLanguage.EN,
  detectBrowserLanguage: {
    useCookie: false, // Disable browser language detection
    cookieKey: 'i18n_redirected',
    alwaysRedirect: false,
    fallbackLocale: CommonLanguage.EN,
  },
  messages: {
    en: {
      dashboard: dashboardEn,
      common: commonEn,
    },
    vi: {
      dashboard: dashboardVi,
      common: commonVi,
    },
  },
}))
