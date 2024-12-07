import { scan } from 'react-scan'

if (process.env.REACT_APP_PROFILE === 'true') {
  scan({
    enabled: true,
    log: false, // logs render info to console (default: false)
  })
}
