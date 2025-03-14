import commonEn from './i18n/en/common'
import commonVi from './i18n/vi/common'
import dashboardEn from './i18n/en/dashboard'
import dashboardVi from './i18n/vi/dashboard'
import cardsEn from './i18n/en/cards'
import cardsVi from './i18n/vi/cards'

import { CommonLanguage } from './types/common'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: CommonLanguage.EN,
  defaultLocale: CommonLanguage.EN,
  messages: {
    en: {
      dashboard: dashboardEn,
      common: commonEn,
      cards: cardsEn,
    },
    vi: {
      dashboard: dashboardVi,
      common: commonVi,
      cards: cardsVi,
    },
  },
}))
