import commonEn from './i18n/en/common'
import commonVi from './i18n/vi/common'
import dashboardEn from './i18n/en/dashboard'
import dashboardVi from './i18n/vi/dashboard'
import cardEn from './i18n/en/card'
import cardVi from './i18n/vi/card'

import { CommonLanguage } from './types/common'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: CommonLanguage.EN,
  defaultLocale: CommonLanguage.EN,
  messages: {
    en: {
      dashboard: dashboardEn,
      common: commonEn,
      card: cardEn,
    },
    vi: {
      dashboard: dashboardVi,
      common: commonVi,
      card: cardVi,
    },
  },
}))
