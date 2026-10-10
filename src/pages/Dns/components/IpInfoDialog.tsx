import React from 'react'
import { useTranslation } from 'react-i18next'

import { DataGroup } from '@/components/Data'
import GeoIPSummary from '@/components/GeoIPSummary'
import { useResponsiveDialog } from '@/components/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import type { Dialog } from '@/components/ui/dialog'
import { useGeoIPSupport } from '@/data/geoip'
import { isIPAddress } from '@/utils/geoip'

type IpInfoDialogProps = {
  domain: string
  addresses: ReadonlyArray<string>
} & Omit<React.ComponentPropsWithoutRef<typeof Dialog>, 'children'>

const IpInfoDialog = ({
  domain,
  addresses,
  ...props
}: IpInfoDialogProps): JSX.Element => {
  const { t } = useTranslation()
  const isSupported = useGeoIPSupport()
  const {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
  } = useResponsiveDialog()
  const ipAddresses = addresses.filter(isIPAddress)

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="break-all">{domain}</DialogTitle>
          <DialogDescription>{t('dns.ip_info.description')}</DialogDescription>
        </DialogHeader>

        {!isSupported ? (
          <p className="text-sm text-muted-foreground">
            {t('dns.ip_info.unsupported')}
          </p>
        ) : ipAddresses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('dns.ip_info.no_address')}
          </p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            <DataGroup>
              {ipAddresses.map((address) => (
                <IpInfoRow key={address} address={address} />
              ))}
            </DataGroup>
          </div>
        )}

        <DialogFooter className="flex md:hidden">
          <DialogClose asChild>
            <Button variant="outline">{t('common.close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const IpInfoRow: React.FC<{ address: string }> = ({ address }) => (
  <div className="px-3 py-2.5 leading-normal @md:px-5">
    <div className="font-mono text-sm break-all">{address}</div>
    <div className="text-xs text-muted-foreground">
      <GeoIPSummary address={address} />
    </div>
  </div>
)

export default IpInfoDialog
