import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './translations/en.json'
import ar from './translations/ar.json'

function applyDocumentLanguage(lng: string) {
  const language = lng.split('-')[0]
  document.documentElement.lang = language
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false,
    },
  })

i18n.on('initialized', () => applyDocumentLanguage(i18n.language))
i18n.on('languageChanged', applyDocumentLanguage)

export default i18n
