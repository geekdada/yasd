import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/shadcn.css'
import './styles/global.css'
import App from './App'
import AppContainer from './AppContainer'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import './i18n'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <AppContainer>
      <App />
    </AppContainer>
  </React.StrictMode>,
)

if (process.env.REACT_APP_USE_SW === 'true') {
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://cra.link/PWA
  serviceWorkerRegistration.register()
}

if (!('scrollBehavior' in document.documentElement.style)) {
  // @ts-ignore
  import('smoothscroll-polyfill').then((mod) => {
    mod.polyfill()
  })
}
