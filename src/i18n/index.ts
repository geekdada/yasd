import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ChainedBackend from 'i18next-chained-backend'
import HttpBackend from 'i18next-http-backend'
import resourcesToBackend from 'i18next-resources-to-backend'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(ChainedBackend)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    backend: {
      backends: [
        HttpBackend,
        resourcesToBackend((lng, ns, clb) => {
          import(`./${lng}/${ns}.json`)
            .then((resources) => clb(null, resources))
            .catch((err) => clb(err, undefined))
        }),
      ],
      backendOptions: [
        {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      ],
    },
  })

export default i18n
