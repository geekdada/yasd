import React from 'react'
import { shallow } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'

import App from './App'

it('renders without crashing', () => {
  shallow(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
})
