export default defineNuxtRouteMiddleware(() => {
    const { locale, setLocale } = useI18n()
    const savedLocale = process.client ? localStorage.getItem('user-locale') : null
  
    if (savedLocale) {
      setLocale(savedLocale)
    } else {
      setLocale('en') // Default locale
    }
  })