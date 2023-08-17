import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { InfoIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TypographyP } from '@/components/ui/typography'

const SWUpdateNotification = ({
  registration,
}: {
  registration?: ServiceWorkerRegistration
}) => {
  const { t } = useTranslation()

  const onClick = useCallback(() => {
    if (registration) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
    }

    window.location.reload()
  }, [registration])

  return (
    <div className="flex justify-center items-center gap-4 py-2">
      <InfoIcon className="stroke-black/80 h-[4rem] w-[4rem]" />
      <div className="space-y-3">
        <TypographyP>{t('common.sw_updated')}</TypographyP>
        <Button variant="secondary" onClick={onClick}>
          {t('common.refresh')}
        </Button>
      </div>
    </div>
  )
}

export default SWUpdateNotification
