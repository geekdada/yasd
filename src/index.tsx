import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  BrowserRouterProps,
  HashRouter,
  HashRouterProps,
} from 'react-router-dom'

import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const ReactRouter: React.FC<BrowserRouterProps | HashRouterProps> = (args) => {
  return process.env.REACT_APP_HASH_ROUTER ? (
    <HashRouter {...(args as HashRouterProps)}>{args.children}</HashRouter>
  ) : (
    <BrowserRouter {...(args as BrowserRouterProps)}>
      {args.children}
    </BrowserRouter>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <ReactRouter>
      <App />
    </ReactRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

if (!('scrollBehavior' in document.documentElement.style)) {
  // @ts-ignore
  import('smoothscroll-polyfill').then((mod) => {
    mod.polyfill()
  })
}
