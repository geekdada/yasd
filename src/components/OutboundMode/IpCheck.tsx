import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw } from 'lucide-react'
import { AspectRatio } from 'radix-ui'

import { Accordion } from '@/components/arc/accordion/accordion'
import { Button } from '@/components/ui/button'

const IP_CHECK_URL = 'https://ip.skk.moe/simple'
const IP_CHECK_ASPECT_RATIO = 375.46 / 235.88

// The Arc accordion styles are unlayered CSS modules, so these overrides need `!` to beat them.
// They line the row up with the other DataGroup rows.
const accordionOverrides = [
  '[&_[data-orientation]]:border-0!',
  '[&_h3>button]:min-h-0! [&_h3>button]:px-3! [&_h3>button]:py-3! @md:[&_h3>button]:px-5! @md:[&_h3>button]:py-4!',
  '[&_h3>button]:font-bold! lg:[&_h3>button]:text-base!',
  '[&_[role=region]>div]:p-2! @md:[&_[role=region]>div]:p-4!',
].join(' ')

type IpCheckProps = {
  // The exit IP depends on the outbound mode, so the page reloads when it changes.
  mode?: string
}

export default function IpCheck({ mode }: IpCheckProps) {
  const { t } = useTranslation()
  // Closed panels stay mounted, so the iframe waits for the first expand to avoid loading on every visit.
  const [hasOpened, setHasOpened] = useState(false)
  // A new iframe key remounts the frame and reloads the cross-origin page.
  const [reloadCount, setReloadCount] = useState(0)

  const frame = hasOpened && (
    <div className="space-y-2">
      <AspectRatio.Root ratio={IP_CHECK_ASPECT_RATIO}>
        <iframe
          key={`${mode}-${reloadCount}`}
          src={IP_CHECK_URL}
          title={t('outbound.ip_check')}
          className="block size-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups"
          referrerPolicy="no-referrer"
        />
      </AspectRatio.Root>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReloadCount((count) => count + 1)}
        >
          <RefreshCw />
          {t('common.refresh')}
        </Button>
      </div>
    </div>
  )

  return (
    <div className={accordionOverrides}>
      <Accordion
        defaultOpen={-1}
        items={[{ title: t('outbound.ip_check'), content: frame }]}
        onOpenChange={(index) => index >= 0 && setHasOpened(true)}
      />
    </div>
  )
}
