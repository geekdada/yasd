import React from 'react'
import { useTranslation } from 'react-i18next'

import { useGeoIP } from '@/data/geoip'
import { formatGeoIP } from '@/utils/geoip'

// Callers check GeoIP support and that the address is an IP before rendering.
const GeoIPSummary: React.FC<{ address: string }> = ({ address }) => {
  const { t, i18n } = useTranslation()
  const { data, error, isLoading } = useGeoIP(address)

  if (isLoading) {
    return <>{t('common.is_loading') + '...'}</>
  }
  if (error || !data) {
    return <>{t('geoip.lookup_failed')}</>
  }
  return <>{formatGeoIP(data, i18n.language) || t('geoip.no_result')}</>
}

export default GeoIPSummary
