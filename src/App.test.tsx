import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { shallow } from 'enzyme'

import App from './App'

it('renders without crashing', () => {
  shallow(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
})
