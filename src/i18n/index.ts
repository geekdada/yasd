import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ChainedBackend from 'i18next-chained-backend'
import resourcesToBackend from 'i18next-resources-to-backend'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(ChainedBackend)
  .init({
    // debug: true,
    lng: navigator.language.substr(0, 2),
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      backends: [
        resourcesToBackend((lng, ns, clb) => {
          import(`./${lng}/${ns}.json`)
            .then((resources) => clb(null, resources))
            .catch((err) => clb(err, undefined))
        }),
      ],
    },
  })

export default i18n
