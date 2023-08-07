import React from 'react'

import { isRunInSurge } from '@/utils'

import { default as RegularLanding } from './Regular'
import { default as SurgeLanding } from './Surge'

const LandingPage = () => {
  return isRunInSurge() ? <SurgeLanding /> : <RegularLanding />
}

export default LandingPage
